<template>
  <div v-if="props.device" class="flex box">
    <div class="flex flex-col w-full">
      <p v-if="props.device.description">
        <b>Description: </b>{{ props.device.description }}
      </p>

      <div v-if="props.device.lastEvent" class="flex flex-row flex-wrap justify-center w-full measurements">
        <span
          v-for="([key, value], index) in Object.entries(
            props.device.lastEvent.measurements
          )"
          :key="key"
          class="flex flex-col m-2 text-center"
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
          <span class="text-center text-xl">
            {{ Math.trunc(value, 2) }}{{ unit(key) }}
          </span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import Time from "@/atoms/Time.vue";
import { Device, MeasurementType, MeasurementKind } from "@/models";

const props = defineProps<{
  organizationId: number;
  collectionId: number;
  device: Device;
  editing: boolean;
}>();

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
    return sensorAlias ? `${humanName}\n${sensorAlias}` : humanName;
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
<style lang="scss" scoped>
.box {
  border: solid 1px #626262;
  padding: 25px;
  height: min-content;
}
.measurements {
  max-width: 27vw;
}
</style>