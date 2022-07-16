<template>
  <div>
    <h4 v-if="!props.device.compiler">Generate new firmware</h4>
    <h3 v-if="!props.device.compiler">
      Device not configured, add sensors and a target to be up to date
    </h3>
    <template v-if="targets">
      <strong>Target: </strong>
      <select
        v-if="props.editing"
        v-model="target"
        @change="updateTarget($event.target.value)"
      >
        <template v-if="targets">
          <option value=""></option>
          <option v-for="target in targets" :key="target.id" :value="target.id">
            {{ targetName(target) }}
          </option>
        </template>
      </select>
      <span v-else-if="target">
        {{ targetName(targets.find((t) => t.id === target)) }}
      </span>
    </template>

    <div>
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
                newSensor.alias = sensorPrototypes.find(
                  (s) => s.id == $event.target.value
                )?.name;
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
            v-for="[index, request] in alignedRequests"
            :key="`${index}-${request.id}`"
            class="flex flex-row mr-2 mb-2"
          >
            {{ request.humanName }}
          </label>
        </span>

        <span class="flex flex-col">
          <span
            v-for="[index, request] in alignedRequests"
            :key="`${index}-${request.id}`"
            class="mb-2"
          >
            <span v-if="props.editing">
              <template
                v-if="
                  [
                    WidgetKind.U8,
                    WidgetKind.U16,
                    WidgetKind.U32,
                    WidgetKind.U64,
                    WidgetKind.F32,
                    WidgetKind.F64,
                  ].includes(request.ty.widget.kind)
                "
              >
                <input v-model="sensorConfigRequests[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="request.ty.widget.kind === WidgetKind.String"
              >
                <input v-model="sensorConfigRequests[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="request.ty.widget.kind === WidgetKind.Selection"
              >
                <select v-model="sensorConfigRequests[`${index}-${request.id}`]">
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
            <span v-else>{{ sensorConfigRequests[`${index}-${request.id}`] }}</span>
          </span>
        </span>
      </div>

      <button v-if="props.editing" @click="create()">Set Compiler</button>
    </div>
  </div>

  <div class="mb-3">
    <p
      v-if="
        props.device.firmware.hash ===
        props.device.compiler?.latestFirmware.hash
      "
      :title="`Firmware MD5: ${props.device.firmware.hash}`"
    >
      Device Up to Date
    </p>
    <p
      v-else
      :title="`Current Firmware MD5: ${props.device.firmware.hash}\nUpdate's Firmware MD5: ${props.device.compiler?.latestFirmware.hash}`"
    >
      Update Available
    </p>
  </div>
  <!--
  <form class="upload" ref="form" v-on:submit.prevent="uploadBinary">
    <div>
      <label for="version">Version:</label>
      <input type="text" name="version" />
    </div>
    <div>
      <label for="binary">Binary File:</label>
      <input type="file" accept=".bin,.bin.gz" name="binary" />
    </div>
    <button type="submit">Upload New Version</button>
  </form>
    -->
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { Device, WidgetKind } from "@/models";
//import UploadService from "@/api/upload";
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
const sensorConfigRequests = ref(
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

const alignedRequests = computed(() => {
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
    deviceId: props.device.id,
    targetId: target.value,
    sensors: [],
    deviceConfigs: [],
  };

  for (const [index, newSensor] of Object.entries(newSensors.value)) {
    if (newSensor.prototypeId === undefined) continue;

    if (!sensorPrototype(newSensor.prototypeId)) {
      throw new Error(`invalid sensor configured: ${newSensor.prototypeId}`);
    }

    const configs = [];
    for (const request of sensorPrototype(newSensor.prototypeId)
      .configurationRequests) {
      if (!sensorConfigRequests.value[`${index}-${request.id}`]) {
        throw new Error(`missing config for ${request.name}`);
      }
      configs.push({
        requestId: request.id,
        value: sensorConfigRequests.value[`${index}-${request.id}`],
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

const updateTarget = (targetId: number) => {
  fetchSensorPrototypes(targetId);
  newSensors.value = [
    {
      prototypeId: ref(undefined),
      alias: ref(undefined),
      color: null,
      sensorId: undefined,
    },
  ];
  sensorConfigRequests.value = {};
};
</script>

<style lang="scss" scoped></style>
