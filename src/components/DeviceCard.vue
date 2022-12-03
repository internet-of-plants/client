<template>
  <div v-if="props.device" class="flex flex-col w-full">
    <strong
      v-if="props.device.name"
      class="text-xl text-center"
    >
      {{ deviceName }}
    </strong>
    <p v-if="props.device.description">
      <b>Description: </b>{{ props.device.description }}
    </p>

    <div v-if="props.device.lastEvent" class="flex flex-row flex-wrap justify-center">
      <span
        v-for="([key, value], index) in Object.entries(
          props.device.lastEvent.measurements
        )"
        :key="key"
        class="flex flex-col m-2"
      >
        <img
          v-if="metadata(key)?.kind === MeasurementKind.SoilTemperature"
          class="w-16 h-16 self-center"
          src="/soil-temperature.png"
        />
        <img
          v-else-if="metadata(key)?.kind === MeasurementKind.SoilMoisture"
          class="w-16 h-16 p-2.5 self-center"
          src="/soil-moisture.png"
        />
        <img
          v-else-if="metadata(key)?.kind === MeasurementKind.AirTemperature"
          class="w-16 h-16 p-3 self-center"
          src="/air-temperature.png"
        />
        <img
          v-else-if="metadata(key)?.kind === MeasurementKind.AirHumidity"
          class="w-16 h-16 p-3.5 self-center"
          src="/air-humidity.png"
        />
        <span class="text-center text-xl"
          >{{ Math.trunc(value, 2) }}{{ unit(key) }}</span
        >
        <p class="text-center" v-for="line in humanName(key).split('\n')" :key="line">{{line}}</p>
        <span
          v-if="
            index ===
            Object.keys(props.device.lastEvent.measurements).length - 1
          "
          class="text-xs text-right"
        >
          <Time :moment="props.device.lastEvent.createdAt" />
        </span>
      </span>
    </div>

    <p v-if="props.device.description">
      <b>Description:&nbsp;</b>{{ props.device.description }}
    </p>

    <p v-if="!props.device.lastEvent">
      Updated at <Time :moment="props.device.updatedAt" />
    </p>

    <p v-if="props.device.compiler && props.device.compiler.latestFirmware.hash !== props.device.firmware.hash"
      :title="`Current Firmware MD5: ${props.device.firmware.hash}\nUpdate's Firmware MD5: ${props.device.compiler.latestFirmware.hash}`"
    >
      Update Available
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Time from "@/atoms/Time.vue";
import { Device, MeasurementType, MeasurementKind } from "@/models";

const props = defineProps<{
  device: Device;
  organizationId: number;
  collectionId: number;
}>();

const deviceName = ref(props.device.name);
watch(() => props.device, (device) => {
  deviceName.value = device.name;
});

const alias = (name: string): string | undefined => {
  return props.device.compiler?.sensors.find((s) =>
    s.measurements.find((m) => m.name === name)
  ).alias;
};

const humanName = (name: string) => {
  const metadata = (props.device.lastEvent?.metadatas ?? []).find(
    (m) => m.name === name
  );

  if (metadata) {
    const humanName = metadata.humanName;
    const sensorAlias = alias(metadata.name);
    return sensorAlias ? `${sensorAlias}\n${humanName}` : humanName;
  } else {
    return name;
  }
};

const metadata = (name: string) => {
  return (props.device.lastEvent?.metadatas ?? []).find((m) => m.name === name);
};

const unit = (name: string) => {
  const metadata = (props.device.lastEvent?.metadatas ?? []).find(
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

<style scoped lang="scss">
</style>
