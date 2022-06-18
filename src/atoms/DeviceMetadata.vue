<template>
  <div v-if="props.device">
    <div class="flex">
      <p v-if="props.device.name"><b>Name: </b>{{ props.device.name }}</p>
      <p v-if="props.device.description">
        <b>Description: </b>{{ props.device.description }}
      </p>
      <p><b>MAC: </b>{{ props.device.mac }}</p>
      <p v-if="props.device.lastUpdate">
        <b>Newest Update Firmware Version:</b>
        {{ props.device.lastUpdate.version }}
      </p>
      <!--<p v-if="props.device.lastUpdate"><b>Newest Update Firmware MD5: </b>{{
        props.device.lastUpdate.fileHash}}</p>-->
      <p><b>Current Firmware MD5: </b>{{ props.device.firmware.hash }}</p>
      <p v-if="props.device.compiler">
        <b>Latest Firmware MD5: </b
        >{{ props.device.compiler.latestFirmware.hash }}
      </p>
      <p>Device signed up <Time :moment="props.device.createdAt" /></p>

      <div v-if="props.device.lastEvent">
        <h3>Last Measurement</h3>
        <p
          v-for="[key, value] of Object.entries(
            props.device.lastEvent.measurements
          )"
          :key="key"
        >
          <b>{{ key }}</b>
          {{ Math.trunc(value, 2) }}{{ unit(key) }}
        </p>
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
        <p>Event from <Time :moment="props.device.lastEvent.createdAt" /></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Time from "@/atoms/Time.vue";
import { DeviceView, MeasurementType } from "@/models";

const props = defineProps<{
  device: DeviceView;
}>();

const unit = (name: string) => {
  const measurement = props.device.lastEvent.metadatas.find((m) => m.name === name);
  if (!measurement) return "";
  switch (measurement.ty) {
    case MeasurementType.Percentage:
      return "%";
    case MeasurementType.RawAnalogRead:
      return "";
    case MeasurementType.FloatCelsius:
      return "ºC";
  }
  return "";
};
</script>
