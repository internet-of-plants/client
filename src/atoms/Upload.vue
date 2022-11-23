<template>
  <span class="box">  
    <span>
      <div class="mb-1 mt-2">
        <p v-if="props.device.firmware.hash === props.device.compiler?.latestFirmware?.hash">
          <span class="text-lg">
            Firmware's MD5:
          </span>
          <span class="text-sm">
            {{ props.device.firmware.hash }}
          </span>
        </p>
        <p
          v-else-if="props.device.compiler"
          :title="`Current Firmware MD5: ${props.device.firmware.hash}\nUpdate's Firmware MD5: ${props.device.compiler?.latestFirmware.hash}`"
        >
          Update Available
        </p>
      </div>
      <h3 v-if="!props.device.compiler">
        <i>
          <p class="text-center">Device not configured</p>
          <p class="text-center">Enable edit mode and specify the device, configuring the integrations</p>
        </i>
      </h3>
      <span v-if="targets" class="mt-2">
        <span class="text-lg mr-1" v-if="props.editing || target">Device:</span>
        <select
          v-if="props.editing"
          v-model="target"
          @change="updateTarget($event.target.value)"
        >
          <option value=""></option>
          <option v-for="target in targets" :key="target.id" :value="target.id" class="text-sm">
            {{ targetName(target) }}
          </option>
        </select>
        <span v-else-if="target" class="text-sm">
          {{ targetName(targets.find((t) => t.id === target)) }}
        </span>
      </span>

      <div v-if="targets && target" class="mt-2">
        <span class="text-lg">Configurations:</span>
        <div class="flex flex-row text-sm">
          <div class="flex flex-col">
            <span
              v-for="request in targets.find((t) => t.id === target)?.configurationRequests"
              :key="request.id"
            >
              {{ request.humanName }}:
            </span>
          </div>

          <div class="flex flex-col ml-2">
            <span
              v-for="request in targets.find((t) => t.id === target)?.configurationRequests"
              :key="request.id"
            >
              <span v-if="props.editing">
                <template v-if="request.ty.widget === DeviceWidgetKind.SSID">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
                <template v-if="request.ty.widget === DeviceWidgetKind.PSK">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
                <template v-if="request.ty.widget === DeviceWidgetKind.Timezone">
                  <select v-model="deviceConfigs[request.id]">
                    <option value=""></option>
                    <option
                      v-for="index in 24"
                      :key="index - 12"
                      :value="`${index - 12}`"
                    >
                      UTC{{ index > 12 ? "+" : "" }}{{ index === 12 ? "" : index - 12 }}
                    </option>
                  </select>
                </template>
              </span>
              <span v-else-if="request.ty.widget === DeviceWidgetKind.Timezone">UTC{{ deviceConfigs[request.id] > 0 ? "+" : "" }}{{ deviceConfigs[request.id] }}</span>
              <span v-else>{{ deviceConfigs[request.id] }}</span>
            </span>
          </div>
        </div>
      </div>

      <div v-if="target" class="mt-2">
        <p class="text-xl">Integrations:</p>
        <p v-if="!props.editing && alignedNewSensors.length === 1 && alignedNewSensors[0].id !== null">No integrations configured</p>
        <div class="flex flex-row">
          <div class="flex flex-col">
            <span
              v-for="([index, newSensor], i) in alignedNewSensors"
              :key="`${i}-${index}`"
              @click.capture="
                if (!(props.editing && newSensor.color !== null)) {
                  $event.preventDefault();
                  $event.stopPropagation();
                }
              "
            >
              <div
                v-if="newSensor.color"
                class="mb-2 slot color-picker"
              >
                <ColorPicker
                  v-model:pure-color="newSensor.color"
                  @update:pure-color="saveColor($event, newSensor.sensorId)"
                />
              </div>
              <div v-else-if="newSensor.color === undefined" class="mb-2 slot"></div>
            </span>
          </div>

          <div class="flex flex-col">
            <span
              v-for="([index, newSensor], i) in alignedNewSensors"
              :key="`${i}-${index}`"
              class="mb-2 slot"
            >
              <select
                v-if="props.editing && (newSensor.prototypeId !== null || i === alignedNewSensors.length - 1)"
                v-model="newSensor.prototypeId"
                @change="
                  newSensor.alias = sensorPrototype($event.target.value)?.name;
                  addSensor($event.target.value);
                "
                class="mr-5 slot"
              >
                <template v-if="sensorPrototypes && target">
                  <option value=""></option>
                  <option
                    v-for="prototype in sensorPrototypes"
                    :key="prototype.id"
                    :value="prototype.id"
                  >
                    {{ prototype.name }}
                  </option>
                </template>
              </select>
              <span
                v-else
                class="mr-5"
              >
                {{ sensorPrototype(newSensor.prototypeId)?.name }}
              </span>
            </span>
          </div>

          <div class="flex flex-col">
            <span
              v-for="([index, newSensor], i) in alignedNewSensors"
              :key="`${i}-${index}`"
              class="mb-2 slot"
            >
              <input
                v-if="props.editing && newSensor.alias !== null"
                v-model="newSensor.alias"
                @blur="saveAlias(newSensor.alias, newSensor.sensorId)"
                class="mr-5"
              />
              <span v-else-if="newSensor.alias !== null" class="mr-5">
                {{ newSensor.alias }}
              </span>
            </span>
          </div>

          <span class="flex flex-col">
            <span
              v-for="[index, request] in alignedSensorConfigRequests"
              :key="`${index}-${request.id}`"
              class="mb-2 mr-2 slot"
            >
              <span v-if="request.ty !== null">{{ request.humanName }}</span>
              <span v-else></span>
            </span>
          </span>

          <span class="flex flex-col ml-2">
            <span
              v-for="[index, request] in alignedSensorConfigRequestValues"
              :key="`${index}-${request.id}`"
            >
              <SensorWidgets v-if="request.ty !== null" :editing="props.editing" :widget="request.ty.widget" v-model="sensorConfigs[`${index}-${request.id}`]" />              
              <span v-else></span>
            </span>
          </span>
        </div>
      </div>
    </span>

    <span class="flex justify-center">
      <button v-if="props.editing" @click="create()">Save</button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, toRef } from "vue";
import { Device, DeviceWidgetKind, SensorWidgetKind } from "@/models";
import SensorWidgets from "@/atoms/SensorWidgets";
import TargetService from "@/api/target";
import CompilerService from "@/api/compiler";
import SensorPrototypeService from "@/api/sensor_prototype";
import SensorService from "@/api/sensor";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const props = defineProps<{
  organizationId: number;
  collectionId: number;
  device: Device;
  editing: boolean;
}>();

const targets = ref(undefined);
const sensorPrototypes = ref(undefined);

const target = ref(props.device.compiler?.target?.id);

const propSensorIds =
  props.device.compiler?.sensors?.map((s) => ({
    prototypeId: ref(s.prototype.id),
    alias: ref(s.alias),
    color: ref(s.color),
    sensorId: s.id,
  })) ?? [];
propSensorIds.push({
  prototypeId: ref(null),
  alias: ref(null),
  color: null,
  sensorId: null,
});

const newSensors = ref(propSensorIds);
const sensorConfigs = ref([]);
const deviceConfigs = ref(
  (props.device.compiler?.deviceConfigs ?? []).reduce(
    (acc, val) => ({
      ...acc,
      [val.requestId]: ref(val.value),
    }),
    {}
  )
);

const sensorPrototype = (id: number) => {
  return sensorPrototypes.value?.find((s) => s.id === id);
};

const emit = defineEmits(["refresh"]);

const saveColor = async (color: string | null, sensorId?: number) => {
  if (!color || !sensorId) return;
  if (
    props.device.compiler?.sensors?.find((s) => s.id === sensorId)?.color ===
    color
  ) {
    return;
  }

  await SensorService.setColor({
    sensorId,
    deviceId: props.device.id,
    color,
  });

  emit("refresh");
};

const saveAlias = async (alias: string, sensorId?: number) => {
  if (!sensorId) return;
  if (
    props.device.compiler?.sensors?.find((s) => s.id === sensorId)?.alias ===
    alias
  ) {
    return;
  }

  await SensorService.setAlias({
    sensorId,
    deviceId: props.device.id,
    alias,
  });

  emit("refresh");
};

const alignedNewSensors = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const prototype = sensorPrototype(newSensor.prototypeId);
    const requests = prototype?.configurationRequests.map(() => ({
      prototypeId: null,
      alias: null,
      color: undefined,
      sensorId: null,
    })) ?? [];

    for (const request of prototype?.configurationRequests ?? []) {
      if (Array.isArray(sensorConfigs.value[`${index}-${request.id}`])) {
        sensorConfigs.value[`${index}-${request.id}`].slice(!Number(props.editing)).forEach(() => {
          requests.push({
            prototypeId: null,
            alias: null,
            color: undefined,
            sensorId: null,
          });
        });
      }
    }
    requests[0] = newSensor;
    return requests.map((request) => [index, request]);
  });
});

const alignedSensorConfigRequestValues = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const prototype = sensorPrototype(newSensor.prototypeId);
    const requests = [];
    for (const request of prototype?.configurationRequests ?? []) {
      requests.push(request);
    }
    return requests.map((request) => [index, request]);
  });
});

const alignedSensorConfigRequests = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const prototype = sensorPrototype(newSensor.prototypeId);
    const requests = [];
    for (const request of prototype?.configurationRequests ?? []) {
      requests.push(request);
      if (Array.isArray(sensorConfigs.value[`${index}-${request.id}`])) {
        sensorConfigs.value[`${index}-${request.id}`].slice(!Number(props.editing)).forEach(() => {
          requests.push({
            prototypeId: null,
            alias: null,
            color: null,
            sensorId: null,
          });
        });
      }
    }
    return requests.map((request) => [index, request]);
  });
});

const removeEmptySensors = () => {
  const toRemove = newSensors.value.map((el, index) => [el, index]).filter(
    ([s]) => {
      return s.prototypeId === null || s.prototypeId === "";
    }
  );

  if (toRemove.length > 0) {
    const configs = { ...sensorConfigs.value };
    for (const [key, value] of Object.entries(configs)) {
      const index = Number(key.split("-")[0]);
      const id = Number(key.split("-")[1]);
    
      delete sensorConfigs.value[`${index}-${id}`];

      if (!toRemove.find(([, i]) => i === index)) {
        const count = toRemove.reduce((acc, [, i]) => i < index ? acc + 1 : acc, 0);
        sensorConfigs.value[`${index - count}-${id}`] = value;    
      }
    }
  }

  newSensors.value = newSensors.value.filter(
    (s) => {
      return s.prototypeId !== null && s.prototypeId !== "";
    }
  );
}

const addSensor = (value) => {
  removeEmptySensors();

  if (newSensors.value.length !== 0) {
    try {
      const id = Number(value);
      const sensor = sensorPrototype(id);
      newSensors.value[newSensors.value.length - 1].alias = sensor.name;
      if (sensor) {
        for (const request of sensor.configurationRequests) {
          if (!sensorConfigs.value[`${newSensors.value.length - 1}-${request.id}`]) {
            sensorConfigs.value[`${newSensors.value.length - 1}-${request.id}`] = ref(null);
          }

          const queue = [{ request: request.ty.widget, config: toRef(sensorConfigs.value, `${newSensors.value.length - 1}-${request.id}`) }];
          let element;

          while (queue.length > 0) {
            element = queue.shift();

            if (element.request.kind === SensorWidgetKind.Map) {
              element.config.value = [];
              queue.push({ request: element.request.data[0], config: toRef(element.config.value[0], "key") });
              queue.push({ request: element.request.data[1], config: toRef(element.config.value[0], "value") });
            }
          }
        }
      }
    } catch {}
  }

  newSensors.value.push({
    prototypeId: ref(null),
    alias: ref(null),
    color: null,
    sensorId: null,
  });
};

const targetName = (target) => {
  if (!target) return "";
  return `${target.arch}${target.board ? "-" + target.board : ""}${
    target.name ? "-" + target.name : ""
  }`;
};

onMounted(async () => {
  targets.value = await TargetService.list();
});

const create = async () => {
  if (!target.value) throw new Error("missing target");
  const newCompiler = {
    targetId: target.value,
    sensors: [],
    deviceConfigs: [],
    deviceId: props.device.id,
  };

  for (const request of targets.value.find((t) => t.id === target.value).configurationRequests) {
    if ((deviceConfigs.value[request.id] ?? null) === null) {
      throw new Error(`missing config for ${request.name}`);
    }

    const value = deviceConfigs.value[request.id];
    switch (request.ty.widget) {
      case DeviceWidgetKind.SSID:
        if (value.length > 32)
          throw new Error(`SSID is too long: ${value}, max length is 32`);
        break;
      case DeviceWidgetKind.PSK:
        if (value.length > 64)
          throw new Error(`PSK is too long: ${value}, max length is 64`);
        break;
    }

    newCompiler.deviceConfigs.push({
      requestId: request.id,
      value,
    });
  }

  for (const [index, newSensor] of Object.entries(newSensors.value)) {
    if (newSensor.prototypeId === null) continue;

    if (!sensorPrototype(newSensor.prototypeId)) {
      throw new Error(`invalid sensor configured: ${newSensor.prototypeId}`);
    }

    const configs = [];
    for (const request of sensorPrototype(newSensor.prototypeId).configurationRequests) {
      if ((sensorConfigs.value[`${index}-${request.id}`] ?? null) === null) {
        throw new Error(`missing config for ${request.name}`);
      }
      configs.push({
        requestId: request.id,
        value: sensorConfigs.value[`${index}-${request.id}`],
      });
    }
    newCompiler.sensors.push({
      prototypeId: newSensor.prototypeId,
      alias: newSensor.alias,
      configs,
    });
  }
  await CompilerService.create(newCompiler);

  emit("refresh");
};

const fetchSensorPrototypes = async (targetId: number) => {
  sensorPrototypes.value = undefined;
  const s = await SensorPrototypeService.listForTarget(targetId);
  sensorPrototypes.value = s;
  
  sensorConfigs.value = Object.entries(props.device.compiler?.sensors ?? [])
    .flatMap(([index, s]) => s.configurations.map((c) => [index, c]))
    .reduce(
      (acc, [index, val]) => {
        let value = val.value;

        const request = sensorPrototypes.value.flatMap((s) => s.configurationRequests).find((c) => c.id === val.requestId);
        if (request.ty.widget.kind === SensorWidgetKind.Map) {
          // Note: This sucks
          // It's bugged, doesn't support map of maps
          const elements = value.slice(1, value.length - 1).split("std::make_pair(").map((el) => el.trim()).filter((el) => el !== "");
          value = [];
          for (const element of elements) {
            element = element.slice(0, element.length - 1 - element.endsWith(","));
            const open = [];
            for (let index = 0; index < element.length; ++index) {
              if (element[index] === "," && open.length === 0) {
                value.push({ key: element.slice(0, index).trim(), value: element.slice(index + 1).trim() });
                break;
              } else if (["[", "(", "{"].includes(element[index])) {
                open.push(element[index]);
              } else if (["]", ")", "}"].includes(element[index])) {
                const opened = open.pop();
                if (!((opened === "[" && element[index] === "]") || (opened === "(" && element[index] === ")") || (opened === "{" && element[index] === "}"))) {
                  throw new Error("invalid c++");
                }
              }
            }
          }
        }
        
        return {
          ...acc,
          [`${index}-${val.requestId}`]: ref(value),
        };
      },
      {}
    )
};

if (target.value) fetchSensorPrototypes(target.value);

const randomString = (size: number) => {
  let output = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < size; ++i) {
    output += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return output;
};

const defaultValue = (widget: DeviceWidgetKind) => {
  switch (widget) {
    case DeviceWidgetKind.SSID:
      return `iop-${randomString(10)}`;
    case DeviceWidgetKind.PSK:
      return randomString(20);
    case DeviceWidgetKind.Timezone:
      return -1 * (new Date()).getTimezoneOffset() / 60;
  }
};

const updateTarget = (targetId: number) => {
  fetchSensorPrototypes(targetId);
  sensorConfigs.value = {};
  newSensors.value = [
    {
      prototypeId: ref(null),
      alias: ref(null),
      color: null,
      sensorId: null,
    },
  ];

  deviceConfigs.value =
    targets.value
      .find((t) => t.id == targetId)
      ?.configurationRequests?.reduce(
        (acc, val) => ({
          ...acc,
          [val.id]: ref(defaultValue(val.ty.widget)),
        }),
        {}
      ) ?? {};
};
</script>

<style lang="scss" scoped>
.slot {
  height: 23px;
}
.box {
  border: solid 1px #626262;
  padding: 25px;
}
button {
  background-color: #A3A3A3;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 4px;
  padding-right: 4px;
  color: #070707;
}
input {
  background-color: #DFDFDF;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
  height: calc(100% - 2px);
}
select {
  background-color: #DFDFDF;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
}
.color-picker {
  width: 37px;
}
</style>
<style lang="scss">
.current-color, .vc-color-wrap {
  width: 28px !important;
}
.vc-color-wrap {
  border: solid 1px #626262;
  border-radius: 3px;
  width: 100%;
  height: 26.5px !important;
}
</style>