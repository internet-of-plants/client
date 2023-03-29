<template>
  <span class="box">  
    <span>
      <div class="mb-1 mt-2">
        <slot name="description"></slot>
      </div>

      <h3 v-if="!props.collection.compiler">
        <i>
          <p class="text-center">{{ props.deviceId ? 'Device' : 'Collection' }} not configured</p>
          <p class="text-center">{{ !props.editing ? "Enable edit mode and c" : "C" }}onfigure the integrations</p>
        </i>
      </h3>
      
      <span v-if="targets" class="mt-2">
        <span class="text-lg mr-1" v-if="customizeCompiler || target">Device:</span>
        <select
          v-if="customizeCompiler"
          v-model="targetId"
          @change="updateTarget($event.target.value)"
        >
          <option value=""></option>
          <option v-for="target in targets" :key="target.id" :value="target.id" class="text-sm">
            {{ targetName(target) }}
          </option>
        </select>
        <span v-else-if="target" class="text-sm">
          {{ targetName(target) }}
        </span>
      </span>

      <div v-if="compilers?.length > 0" class="mt-2">
        <span v-if="props.editing">{{ compiler ? "" : "Inherit " }}Configurations From:</span>
        <select v-if="props.editing" v-model="compilerId" class="ml-2">
          <option v-if="compiler?.devicesCount > 1" value="">new</option>
          <option v-for="c in compilers" :key="c.id" :value="c.id">{{ c.collectionName }}</option>
        </select>
        <span v-else-if="compiler">Collection: {{ compiler.collectionName }}</span>
      </div>

      <div v-if="target" class="mt-2">
        <span class="text-lg">Configurations:</span>
        <div class="flex flex-row text-sm">
          <div class="flex flex-col">
            <span
              v-for="request in target.configurationRequests"
              :key="request.id"
            >
              {{ request.humanName }}:
            </span>
          </div>

          <div class="flex flex-col ml-2">
            <div
              v-for="request in target.configurationRequests"
              :key="request.id"
              class="h-full"
            >
              <span v-if="customizeCompiler">
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
            </div>
          </div>
        </div>
      </div>

      <div v-if="target" class="mt-2">
        <p class="text-xl">Integrations:</p>
        <p v-if="!customizeCompiler && alignedNewSensors.length === 1 && alignedNewSensors[0].id !== null">No integrations configured</p>
        <div class="flex flex-row">
          <div class="flex flex-col">
            <span
              v-for="([index, newSensor], i) in alignedNewSensors"
              :key="`${i}-${index}`"
              @click.capture="
                if (!(customizeCompiler && newSensor.color !== null)) {
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
                v-if="customizeCompiler && (newSensor.prototypeId !== null || i === alignedNewSensors.length - 1)"
                v-model="newSensor.prototypeId"
                @change="
                  addSensor($event.target.value);
                "
                class="mr-5 slot"
              >
                <template v-if="sensorPrototypes && targetId">
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
              <span v-else class="mr-5">
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
                v-if="customizeCompiler && newSensor.alias !== null"
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
              <SensorWidgets v-if="request.ty !== null" :editing="customizeCompiler" :widget="request.ty.widget" v-model="sensorConfigs[`${index}-${request.id}`]" :new-sensors="newSensors" :sensor-prototypes="sensorPrototypes"/>
              <span v-else></span>
            </span>
          </span>
        </div>
      </div>
    </span>

    <span v-if="customizeCompiler || (props.editing && compilerId !== props.collection.compiler?.id)" class="flex justify-center pt-3">
      <button v-if="!loading" @click="create()">Save</button>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 loading">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </span>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, toRef, watch } from "vue";
import { DeviceWidgetKind, SensorWidgetKind, Collection } from "@/models";
import SensorWidgets from "@/atoms/SensorWidgets";
import TargetService from "@/api/target";
import CompilerService from "@/api/compiler";
import SensorPrototypeService from "@/api/sensor_prototype";
import SensorService from "@/api/sensor";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const props = defineProps<{
  organizationId: number;
  collection: Collection;
  deviceId?: number;
  editing: boolean;
}>();

const emit = defineEmits(["refresh"]);

const loading = ref(false);
const targets = ref(undefined);
const compilers = ref(undefined);
const sensorPrototypes = ref(undefined);
const compilerId = ref("");

const compiler = computed(() => {
  return compilers.value?.find((c) => c.id === compilerId.value);
});

const customizeCompiler = computed(() => {
  return props.editing && (compiler.value?.devicesCount === 1 || compilerId.value === "");
});

const targetId = ref(props.collection.compiler?.target.id);

const target = computed(() => {
  return targets.value?.find((t) => t.id === targetId.value);
});

const sensorPrototype = (id: number) => {
  return sensorPrototypes.value?.find((s) => s.id === id);
};

const sensor = (sensorId: number) => {
  return compiler.value?.sensors.find((s) => s.id === sensorId);
};

function randomString(size: number) {
  let output = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < size; ++i) {
    output += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return output;
}

function defaultValue(widget: DeviceWidgetKind) {
  switch (widget) {
    case DeviceWidgetKind.SSID:
      return `iop-${randomString(10)}`;
    case DeviceWidgetKind.PSK:
      return randomString(20);
    case DeviceWidgetKind.Timezone:
      return `${-1 * (new Date()).getTimezoneOffset() / 60}`;
  }
}

function randomPk() {
    return Math.floor(Math.random() * 50000);
}

function buildNewSensors() {
  const list = compiler.value?.sensors.map((s) => ({
    localPk: randomPk(),
    prototypeId: ref(s.prototype.id),
    alias: ref(s.alias),
    color: ref(s.color),
    sensorId: s.id,
  })) ?? [];
  list.push({
    localPk: randomPk(),
    prototypeId: ref(null),
    alias: ref(null),
    color: null,
    sensorId: null,
  });
  return list;
}

function buildDeviceConfigs() {
  const values = compiler.value?.deviceConfigs
    .reduce((acc, val) => ({
      ...acc,
      [val.requestId]: ref(val.value),
    }), {});
  if (compilers.value && values === undefined) {
    return target.value?.configurationRequests.reduce(
        (acc, val) => ({
          ...acc,
          [val.id]: ref(defaultValue(val.ty.widget)),
        }),
        {}
    ) ?? {};
  }
  return values;
}

const newSensors = ref([]);
const sensorConfigs = ref([]);
const deviceConfigs = ref({});

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
        sensorConfigs.value[`${index}-${request.id}`].slice(!Number(customizeCompiler.value)).forEach(() => {
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
        sensorConfigs.value[`${index}-${request.id}`].slice(!Number(customizeCompiler.value)).forEach(() => {
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
  const toRemove = newSensors.value
    .map((el, index) => [el, index])
    .filter(([s]) => {
      return s.prototypeId === null || s.prototypeId === "";
    });

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

  newSensors.value = newSensors
    .value
    .filter((s) => {
      return s.prototypeId !== null && s.prototypeId !== "";
    });
}

const addSensor = (value) => {
  removeEmptySensors();

  if (newSensors.value.length !== 0) {
    try {
      const id = Number(value);
      const sensor = sensorPrototype(id);
      newSensors.value[newSensors.value.length - 1].localPk = randomPk();
      newSensors.value[newSensors.value.length - 1].alias = sensor.name;

      // Cleanup sensorConfigs if sensor changed
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
    } catch (err) {
      console.error(err);
    }
  }

  newSensors.value.push({
    localPk: randomPk(),
    prototypeId: ref(null),
    alias: ref(null),
    color: null,
    sensorId: null,
  });
};

const create = async () => {
  loading.value = true;
  if (compilerId.value !== "" && compilerId.value !== props.collection.compiler?.id) {
    const obj = {
      compilerId: compilerId.value,
      deviceId: props.deviceId
    };
    if (!props.deviceId) obj.collectionId = props.collection.id;
    await CompilerService.set(obj);
  } else {
    if (!target.value) throw new Error("missing target");
    const newCompiler = {
      targetId: target.value.id,
      sensors: [],
      deviceConfigs: [],
      deviceId: props.deviceId ?? null,
      collectionId: props.collection.id,
    };

    for (const request of target.value.configurationRequests) {
      if ((deviceConfigs.value[request.id] ?? "") === "") {
        loading.value = false;
        throw new Error(`missing config for ${request.name}`);
      }

      const value = deviceConfigs.value[request.id];
      switch (request.ty.widget) {
        case DeviceWidgetKind.SSID:
          if (value.length > 32) {
            loading.value = false;
            throw new Error(`SSID is too long: ${value}, max length is 32`);
          }
          break;
        case DeviceWidgetKind.PSK:
          if (value.length > 64) {
            loading.value = false;
            throw new Error(`PSK is too long: ${value}, max length is 64`);
          }
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
        loading.value = false;
        throw new Error(`invalid sensor configured: ${newSensor.prototypeId}`);
      }

      const configs = [];
      for (const request of sensorPrototype(newSensor.prototypeId).configurationRequests) {
        if ((sensorConfigs.value[`${index}-${request.id}`] ?? "") === "") {
          loading.value = false;
          throw new Error(`missing config for ${request.name}`);
        }
        configs.push({
          requestId: request.id,
          value: sensorConfigs.value[`${index}-${request.id}`],
        });
      }
      newCompiler.sensors.push({
        localPk: newSensor.localPk,
        prototypeId: newSensor.prototypeId,
        alias: newSensor.alias,
        configs,
      });
    }
    await CompilerService.create(newCompiler);
  }

  loading.value = false;
  emit("refresh");
};

async function fetchCompilers(id) {
  if (!id) {
    compilers.value = [];
  } else {
    compilers.value = await CompilerService.list({ targetId: id, organizationId: props.organizationId });
  }
  targetId.value = parseInt(id);
}

async function fetchSensorPrototypes(targetId: number) {
  sensorPrototypes.value = undefined;
  const s = await SensorPrototypeService.listForTarget(targetId);
  sensorPrototypes.value = s;
  
  sensorConfigs.value = Object.entries(compiler.value?.sensors ?? [])
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
    );
}

const saveColor = async (color: string | null, sensorId?: number) => {
  if (!color || !sensor.value) return;
  if (sensor.value?.color === color) return;

  await SensorService.setColor({
    sensorId,
    deviceId: props.deviceId,
    color,
  });

  emit("refresh");
};

const targetName = (target) => {
  if (!target) return "";

  return `${target.arch}${target.board ? "-" + target.board : ""}${
    target.name ? "-" + target.name : ""
  }`;
};

const saveAlias = async (alias: string, sensorId?: number) => {
  if (!sensorId) return;
  if (sensor(sensorId)?.alias === alias) return;

  await SensorService.setAlias({
    sensorId,
    deviceId: props.deviceId,
    alias,
  });

  emit("refresh");
};

const updateTarget = async (id: number | undefined) => {
  if (!id) return;
  await fetchCompilers(id);
  newSensors.value = buildNewSensors();
  await fetchSensorPrototypes(id);

  deviceConfigs.value = buildDeviceConfigs();
};

const load = async () => {
  targets.value = await TargetService.list();
  targetId.value = props.collection.compiler?.target.id;
  compilerId.value = props.collection.compiler?.id ?? "";
};

watch(() => props.device, load);
onMounted(load);

watch(compilerId, async () => {
  if (!compiler.value) {
    await updateTarget(props.collection.compiler?.target.id);
  } else {
    await updateTarget(compiler.value?.target.id);
  }
});
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
.loading {
  animation: rotation 2s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
