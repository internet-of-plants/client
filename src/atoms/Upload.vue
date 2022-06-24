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
      <span v-else>
        {{ targetName(targets?.find((t) => t.id === target)) }}
      </span>
    </template>

    <div>
      <strong>Sensors:</strong>
      <div class="flex flex-row">
        <div class="flex flex-col">
          <span
            v-for="[index, newSensor] in alignedNewSensors"
            :key="index"
            class="mb-2"
          >
            <select
              v-if="editing && newSensor.prototypeId !== null"
              v-model="newSensor.prototypeId"
              @change="addSensor()"
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
              v-else-if="!editing && newSensor.prototypeId !== undefined"
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
              v-if="editing && newSensor.alias !== null"
              v-model="newSensor.alias"
              @blur="
                saveAlias(
                  newSensor.alias,
                  newSensor.sensorId,
                  props.device.compiler?.id
                )
              "
              class="mr-5"
            />
            <span
              v-else-if="!editing && newSensor.alias !== undefined"
              class="mr-5"
            >
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
            <span v-if="editing">
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
                <input v-model="configRequests[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="request.ty.widget.kind === WidgetKind.String"
              >
                <input v-model="configRequests[`${index}-${request.id}`]" />
              </template>
              <template
                v-else-if="request.ty.widget.kind === WidgetKind.Selection"
              >
                <select v-model="configRequests[`${index}-${request.id}`]">
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
            <span v-else>{{ configRequests[`${index}-${request.id}`] }}</span>
          </span>
        </span>
      </div>

      <button v-if="editing" @click="create()">Set Compiler</button>
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
import { DeviceView, WidgetKind } from "@/models";
//import UploadService from "@/api/upload";
import TargetService from "@/api/target";
import CompilerService from "@/api/compiler";
import SensorPrototypeService from "@/api/sensor_prototype";
import SensorService from "@/api/sensor";

const props = defineProps<{
  organizationId: number;
  collectionId: number;
  device: DeviceView;
  editing: boolean;
}>();

//const form = ref<HTMLFormElement | null>(null);

const targets = ref(undefined);
const sensorPrototypes = ref(undefined);

const target = ref(props.device.compiler?.target?.id);
const propSensorIds =
  props.device.compiler?.sensors?.map((s) => ({
    prototypeId: ref(s.prototype.id),
    alias: ref(s.alias),
    sensorId: s.id,
  })) ?? [];
propSensorIds.push({
  prototypeId: ref(undefined),
  alias: ref(undefined),
  sensorId: undefined,
});

const newSensors = ref(propSensorIds);
const configRequests = ref(
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

const saveAlias = async (
  alias: string,
  sensorId?: number,
  compilerId?: number
) => {
  if (!sensorId || !compilerId) return;
  if (
    props.device.compiler?.sensors?.find((s) => s.id === sensorId)?.alias ===
    alias
  )
    return;
  await SensorService.setAlias({
    sensorId,
    compilerId,
    alias,
  });
};

const alignedNewSensors = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const requests =
      sensorPrototype(newSensor.prototypeId)?.configuration_requests.map(
        () => ({ prototypeId: null, alias: null, sensorId: undefined })
      ) ?? [];
    requests[0] = newSensor;
    return requests.map((request) => [index, request]);
  });
});

const alignedRequests = computed(() => {
  return Object.entries(newSensors.value).flatMap(([index, newSensor]) => {
    const requests =
      sensorPrototype(newSensor.prototypeId)?.configuration_requests ?? [];
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
    sensorId: undefined,
  });
};

const targetName = (target) => {
  return `${target.arch}${target.board ? "-" + target.board : ""}`;
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
  };

  for (const [index, newSensor] of Object.entries(newSensors.value)) {
    if (newSensor.prototypeId === undefined) continue;

    if (!sensorPrototype(newSensor.prototypeId)) {
      throw new Error(`invalid sensor configured: ${newSensor.prototypeId}`);
    }

    const configs = [];
    for (const request of sensorPrototype(newSensor.prototypeId)
      .configuration_requests) {
      if (!configRequests.value[`${index}-${request.id}`]) {
        throw new Error(`missing config for ${request.name}`);
      }
      configs.push({
        requestId: request.id,
        value: configRequests.value[`${index}-${request.id}`],
      });
    }
    newCompiler.sensors.push({
      prototypeId: newSensor.prototypeId,
      alias: newSensor.alias,
      configs,
    });
  }
  await CompilerService.create(newCompiler);
  // TODO: redirect?
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
    { prototypeId: ref(undefined), alias: ref(undefined), sensorId: undefined },
  ];
  configRequests.value = {};
};

/*
const useFirmware = async () => {
  if (!form?.value) throw new Error("Form is null");
  await UploadService.useFirmware({
    organizationId: props.organizationId,
    collectionId: props.collectionId,
    deviceId: props.device.id,
    form: new FormData(form.value),
  });

  router.push({ path: "/" });
};

const uploadBinary = async () => {
  if (!form?.value) throw new Error("Form is null");
  await UploadService.create({
    organizationId: props.organizationId,
    collectionId: props.collectionId,
    deviceId: props.device.id,
    form: new FormData(form.value),
  });

  router.push({ path: "/" });
};
*/
</script>
