<template>
  <div v-if="props.device" class="flex">
    <div class="flex flex-col">
      <strong
        v-if="props.device.name && !props.editing"
        :title="`Device's MAC address: ${props.device.mac}`"
        class="text-2xl text-center"
      >
        {{ deviceName }}
      </strong>
      <input
        v-else-if="props.device.name && props.editing"
        v-model="deviceName"
        :title="`Device's MAC address: ${props.device.mac}`"
        class="text-2xl text-center"
        type="text"
        @blur="saveName()"
      />
      <p v-if="props.device.description">
        <b>Description: </b>{{ props.device.description }}
      </p>
      <!--<p>Device signed up <Time :moment="props.device.createdAt" /></p>-->

      <div v-if="props.device.lastEvent" class="flex flex-row">
        <span
          v-for="([key, value], index) in Object.entries(
            props.device.lastEvent.measurements
          )"
          :key="key"
          :title="humanName(key)"
          class="flex flex-col m-2"
        >
          <img
            v-if="metadata(key)?.kind === MeasurementKind.SoilTemperature"
            class="w-16 h-16"
            src="/soil-temperature.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.SoilMoisture"
            class="w-16 h-16 p-2.5"
            src="/soil-moisture.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.AirTemperature"
            class="w-16 h-16 p-3"
            src="/air-temperature.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.AirHumidity"
            class="w-16 h-16 p-3.5"
            src="/air-humidity.png"
          />
          <span class="text-center text-xl"
            >{{ Math.trunc(value, 2) }}{{ unit(key) }}</span
          >
          <span
            v-if="
              index ===
              Object.keys(props.device.lastEvent.measurements).length - 1
            "
            class="text-xs"
          >
            <Time :moment="props.device.lastEvent.createdAt" />
          </span>
        </span>
        <!--
          {{ props.device.lastEvent.air_temperature_celsius }}ºC
        </p>
        <p>
          <b>Air humidity:</b>
          {{ props.device.lastEvent.air_humidity_percentage }}%
        </p>
        <p>
          <b>Soil temperature:</b>
          {{ props.device.lastEvent.soil_temperature_celsius }}ºC
        </p>
        <p>
          <b>Soil resistivity:</b>
          {{ props.device.lastEvent.soil_resistivity_raw }} raw
          <small>(0-1200)</small>
        </p>
        -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Time from "@/atoms/Time.vue";
import { DeviceView, MeasurementType, MeasurementKind } from "@/models";
import DeviceService from "@/api/device";

const props = defineProps<{
  organizationId: number;
  collectionId: number;
  device: DeviceView;
  editing: boolean;
}>();

// TODO: change this when prop is updated
const deviceName = ref(props.device.name);

const saveName = async () => {
  if (deviceName.value === props.device.name) return;

  await DeviceService.setName({
    organizationId: props.organizationId,
    collectionId: props.collectionId,
    deviceId: props.device.id,
    name: deviceName.value,
  });
};

const humanName = (name: string) => {
  const metadata = props.device.lastEvent.metadatas.find(
    (m) => m.name === name
  );
  return metadata?.humanName ?? name;
};

const metadata = (name: string) => {
  return props.device.lastEvent.metadatas.find((m) => m.name === name);
};

const unit = (name: string) => {
  const metadata = props.device.lastEvent.metadatas.find(
    (m) => m.name === name
  );
  if (!metadata) return "";
  switch (metadata.ty) {
    case MeasurementType.Percentage:
      return "%";
    case MeasurementType.RawAnalogRead:
      return "";
    case MeasurementType.FloatCelsius:
      return "ºC";
  }
};
</script>
