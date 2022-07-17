<template>
  <div>
    <h3 v-if="!props.device.compiler">
      <i>
        <p>Device not configured, add a target and sensors</p>
        <p>To properly monitor events and provider automatic updates</p>
      </i>
    </h3>
    <template v-if="targets">
      <strong v-if="props.editing || target">Target: </strong>
      <select
        v-if="props.editing"
        v-model="target"
        @change="updateTarget($event.target.value)"
      >
        <option value=""></option>
        <option v-for="target in targets" :key="target.id" :value="target.id">
          {{ targetName(target) }}
        </option>
      </select>
      <span v-else-if="target">
        {{ targetName(targets.find((t) => t.id === target)) }}
      </span>
    </template>

    <div v-if="target">
      <strong>Sensors:</strong>
      <div class="flex flex-row">
        <div class="flex flex-col">
          <span
            v-for="[index, newSensor] in alignedNewSensors"
            :key="index"
            @click.capture="
              if (!(props.editing && newSensor.color !== null)) {
                $event.preventDefault();
                $event.stopPropagation();
              }
            "
            :class="[newSensor.color ? undefined : 'opacity-0']"
            class="mb-2"
          >
            <ColorPicker
              v-model:pure-color="newSensor.color"
              @update:pure-color="saveColor($event, newSensor.sensorId)"
              class="mr-5"
            />
          </span>
        </div>

        <div class="flex flex-col">
          <span
            v-for="[index, newSensor] in alignedNewSensors"
            :key="index"
            class="mb-2"
          >
            <select
              v-if="props.editing && newSensor.prototypeId !== null"
              v-model="newSensor.prototypeId"
              @change="
                newSensor.alias = sensorPrototype($event.target.value)?.name;
                addSensor(newSensor, $event.target.value);
              "
              class="mr-5"
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
              v-else-if="newSensor.prototypeId !== undefined"
              class="mr-5"
              >{{ sensorPrototype(newSensor.prototypeId)?.name }}</span
            >
          </span>
        </div>

        <div class="flex flex-col">
          <span
            v-for="[index, newSensor] in alignedNewSensors"
            :key="index"
            class="mb-2"
          >
            <input
              v-if="props.editing && newSensor.alias !== null"
              v-model="newSensor.alias"
              @blur="saveAlias(newSensor.alias, newSensor.sensorId)"
              class="mr-5"
            />
            <span v-else-if="newSensor.alias !== undefined" class="mr-5">
              {{ newSensor.alias }}
            </span>
          </span>
        </div>

        <span class="flex flex-col">
          <label
            v-for="[index, request] in alignedSensorConfigRequests"
            :key="`${index}-${request.id}`"
            class="flex flex-row mr-2 mb-2"
          >
            {{ request.humanName }}
          </label>
        </span>

        <span class="flex flex-col ml-2">
          <span
            v-for="[index, request] in alignedSensorConfigRequests"
            :key="`${index}-${request.id}`"
            class="mb-2"
          >
            <span v-if="props.editing">
              <template
                v-if="
                  [
                    SensorWidgetKind.U8,
                    SensorWidgetKind.U16,
                    SensorWidgetKind.U32,
                    SensorWidgetKind.U64,
                    SensorWidgetKind.F32,
                    SensorWidgetKind.F64,
                  ].includes(request.ty.widget.kind)
                "
              >
                <input v-model="sensorConfigs[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="request.ty.widget.kind === SensorWidgetKind.String"
              >
                <input v-model="sensorConfigs[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="
                  request.ty.widget.kind === SensorWidgetKind.Selection
                "
              >
                <select v-model="sensorConfigs[`${index}-${request.id}`]">
                  <option value=""></option>
                  <option
                    v-for="opt in request.ty.widget.data"
                    :key="opt"
                    :value="opt"
                  >
                    {{ opt }}
                  </option>
                </select>
              </template>
            </span>
            <span v-else>{{ sensorConfigs[`${index}-${request.id}`] }}</span>
          </span>
        </span>
      </div>

      <div v-if="targets && target">
        <strong>Device Configurations:</strong>
        <div class="flex flex-row">
          <div class="flex flex-col">
            <span
              v-for="request in targets.find((t) => t.id === target)
                ?.configurationRequests"
              :key="request.id"
              class="mb-2"
            >
              {{ request.humanName }}
            </span>
          </div>

          <div class="flex flex-col ml-2">
            <span
              v-for="request in targets.find((t) => t.id === target)
                ?.configurationRequests"
              :key="request.id"
              class="mb-2"
            >
              <span v-if="props.editing">
                <template v-if="request.ty.widget === DeviceWidgetKind.SSID">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
                <template v-if="request.ty.widget === DeviceWidgetKind.PSK">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
              </span>
              <span v-else>{{ deviceConfigs[request.id] }}</span>
            </span>
          </div>
        </div>

        <button v-if="props.editing" @click="create()">Set Compiler</button>
      </div>
    </div>
  </div>

  <div class="mb-3">
    <p
      v-if="
        props.device.firmware.hash ===
        props.device.compiler?.latestFirmware?.hash
      "
      :title="`Firmware MD5: ${props.device.firmware.hash}`"
    >
      Device Up to Date
    </p>
    <p
      v-else-if="props.device.compiler"
      :title="`Current Firmware MD5: ${props.device.firmware.hash}\nUpdate's Firmware MD5: ${props.device.compiler?.latestFirmware.hash}`"
    >
      Update Available
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { Device, SensorWidgetKind, DeviceWidgetKind } from "@/models";
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
  prototypeId: ref(undefined),
  alias: ref(undefined),
  color: null,
  sensorId: undefined,
});

const newSensors = ref(propSensorIds);
const sensorConfigs = ref(
  Object.entries(props.device.compiler?.sensors ?? [])
    .flatMap(([index, s]) => s.configurations.map((c) => [index, c]))
    .reduce(
      (acc, [index, val]) => ({
        ...acc,
        [`${index}-${val.requestId}`]: ref(val.value),
      }),
      {}
    )
);
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
  return sensorPrototypes.value?.find((s) => s.id == id);
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
    const requests =
      sensorPrototype(newSensor.prototypeId)?.configurationRequests.map(() => ({
        prototypeId: null,
        alias: null,
        color: null,
        sensorId: undefined,
      })) ?? [];
    requests[0] = newSensor;
    return requests.map((request) => [index, request]);
  });
});

const alignedSensorConfigRequests = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const requests =
      sensorPrototype(newSensor.prototypeId)?.configurationRequests ?? [];
    return requests.map((request) => [index, request]);
  });
});

const addSensor = () => {
  newSensors.value = newSensors.value.filter(
    (s) => s.prototypeId !== undefined
  );
  newSensors.value.push({
    prototypeId: ref(undefined),
    alias: ref(undefined),
    color: null,
    sensorId: undefined,
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

  for (const request of targets.value.find((t) => t.id === target.value)
    .configurationRequests) {
    if (deviceConfigs.value[request.id] === undefined) {
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
    if (newSensor.prototypeId === undefined) continue;

    if (!sensorPrototype(newSensor.prototypeId)) {
      throw new Error(`invalid sensor configured: ${newSensor.prototypeId}`);
    }

    const configs = [];
    for (const request of sensorPrototype(newSensor.prototypeId)
      .configurationRequests) {
      if (sensorConfigs.value[`${index}-${request.id}`] === undefined) {
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
  }
};

const updateTarget = (targetId: number) => {
  fetchSensorPrototypes(targetId);
  sensorConfigs.value = {};
  newSensors.value = [
    {
      prototypeId: ref(undefined),
      alias: ref(undefined),
      color: null,
      sensorId: undefined,
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

<style lang="scss" scoped></style>
