<template>
  <!--
  <div v-if="!props.device.compiler">
    <h3>Upload new firmware</h3>
    <form class="upload" ref="form" v-on:submit.prevent="useFirmware">
      <div>
        <label for="version">Firmware:</label>
        <select name="firmware" v-for="f in firmwares" :key="f.id">
          <option value="f.id">
            {{ f.compilation.compiler.targetArch }} -
            {{ f.compilation.compiler.sensorNames.join(", ") }}
          </option>
        </select>
      </div>
      <button type="submit">Use this firmware</button>
    </form>
  </div>
  -->

  <div>
    <h4 v-if="!props.device.compiler">Generate new firmware</h4>
    <h3 v-if="!props.device.compiler">
      Device not configured, add sensors and a target to be up to date
    </h3>
    <div>
      <strong>Target:</strong>
      <select
        v-model="target"
        @change="
          fetchSensorPrototypes($event.target.value);
          newSensors.value = [ref(undefined)];
          configRequests.value = {};
        "
      >
        <template v-if="targets">
          <option value=""></option>
          <option v-for="target in targets" :key="target.id" :value="target.id">
            {{ target.arch }} {{ target.board ? "-" + target.board : "" }}
          </option>
        </template>
      </select>
    </div>

    <div>
      <strong>Sensors:</strong>
      <div v-for="newSensor in newSensors" :key="newSensor.value">
        <select
          v-model="newSensor.value"
          @change="newSensors.push(ref(undefined))"
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

        <template v-if="sensorPrototype(newSensor.value)">
          <div
            v-for="request in sensorPrototype(newSensor.value)
              .configuration_requests"
            :key="request.id"
          >
            <label>{{ request.name }}: {{ request.ty.name }}</label>
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
              <input v-model="configRequests[request.id]" />
            </template>
            <template v-else-if="request.ty.widget.kind === WidgetKind.String">
              <input v-model="configRequests[request.id]" />
            </template>
            <template
              v-else-if="request.ty.widget.kind === WidgetKind.Selection"
            >
              <select v-model="configRequests[request.id]">
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
          </div>
        </template>
      </div>

      <button @click="create()">Set Compiler</button>
    </div>
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
import { onMounted, ref } from "vue";
import { DeviceView, WidgetKind } from "@/models";
//import UploadService from "@/api/upload";
import FirmwareService from "@/api/firmware";
import TargetService from "@/api/target";
import CompilerService from "@/api/compiler";
import SensorPrototypeService from "@/api/sensor_prototype";

const props = defineProps<{
  organizationId: number;
  collectionId: number;
  device: DeviceView;
}>();

//const form = ref<HTMLFormElement | null>(null);

const firmwares = ref(undefined);
const targets = ref(undefined);
const sensorPrototypes = ref(undefined);

const target = ref(props.device.compiler?.target?.id);
const propSensorIds =
  props.device.compiler?.sensors?.map((s) => ref(s.prototype.id)) ?? [];
propSensorIds.push(ref(undefined));

const newSensors = ref(propSensorIds);
const configRequests = ref(
  props.device.compiler?.sensors
    ?.flatMap((s) => s.configurations)
    ?.reduce((acc, val) => ({ ...acc, [val.requestId]: ref(val.value) }), {}) ??
    {}
);
const sensorPrototype = (id: number) => {
  return sensorPrototypes.value?.find((s) => s.id === id);
};

onMounted(async () => {
  firmwares.value = await FirmwareService.list({
    organizationId: props.organizationId,
    collectionId: props.collectionId,
    deviceId: props.device.id,
  });

  targets.value = await TargetService.list();
});

const create = async () => {
  if (!target.value) throw new Error("missing target");
  const newCompiler = {
    deviceId: props.device.id,
    targetId: target.value,
    sensors: [],
  };

  for (const newSensor of newSensors.value) {
    if (newSensor.value === undefined || newSensor.value === "") continue;

    if (!sensorPrototype(newSensor.value)) {
      throw new Error(`invalid sensor configured: ${newSensor.value}`);
    }

    const configs = [];
    for (const request of sensorPrototype(newSensor.value)
      .configuration_requests) {
      if (!configRequests.value[request.id]) {
        throw new Error(`missing config for ${request.name}`);
      }
      configs.push({
        requestId: request.id,
        value: configRequests.value[request.id],
      });
    }
    newCompiler.sensors.push({
      prototypeId: newSensor.value,
      configs,
    });
  }
  await CompilerService.create(newCompiler);
  // TODO: redirect?
};

const fetchSensorPrototypes = async (targetId: number) => {
  sensorPrototypes.value = undefined;
  const s = await SensorPrototypeService.listForTarget(targetId);
  if (configRequests.value === undefined) {
    configRequests.value = s
      .flatMap((p) => p.configuration_requests)
      .map((r) => r.id)
      .reduce((acc, val) => ({ ...acc, [val]: ref(undefined) }), {});
  }
  sensorPrototypes.value = s;
};
if (target.value) fetchSensorPrototypes(target.value);

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
