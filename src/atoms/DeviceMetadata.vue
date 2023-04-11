<template>
  <div v-if="props.device" class="flex box">
    <div class="flex flex-col w-full">
      <p v-if="props.device.description"><b>Description: </b>{{ props.device.description }}</p>

      <div
        v-if="props.device.lastEvent"
        class="flex flex-row flex-wrap justify-center measurements"
      >
        <span
          v-for="([key, value], index) in Object.entries(props.device.lastEvent.measurements)"
          :key="key"
          class="flex flex-col m-2 text-center"
        >
          <img
            v-if="metadata(key)?.kind === MeasurementKind.SoilTemperature"
            class="w-14 h-14 self-center"
            src="/soil-temperature.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.SoilMoisture"
            class="w-14 h-14 p-2.5 self-center"
            src="/soil-moisture.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.AirTemperature"
            class="w-14 h-14 p-3 self-center"
            src="/air-temperature.png"
          />
          <img
            v-else-if="metadata(key)?.kind === MeasurementKind.AirHumidity"
            class="w-14 h-14 p-3.5 self-center"
            src="/air-humidity.png"
          />
          <span class="text-center text-l"> {{ formatDecimalPlaces(value) }}{{ unit(key) }} </span>
          <p class="text-center text-sm" v-for="line in name(key).split('\n')" :key="line">
            {{ line }}
          </p>
          <span
            v-if="index === Object.keys(props.device.lastEvent.measurements).length - 1"
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
import Time from '@/atoms/IopTime.vue'
import type { Device } from '@/models'
import { MeasurementKind, MeasurementType } from '@/models'

const props = defineProps<{
  device: Device
  editing: boolean
}>()

const alias = (name: string): string | undefined => {
  return (props.device.compiler?.sensors ?? []).find((s) =>
    s.measurements.find((m) => m.variableName === name)
  )?.alias
}

const name = (name: string) => {
  const metadata = (props.device.lastEvent?.metadatas ?? []).find((m) => m.variableName === name)

  if (metadata) {
    const name = metadata.name
    const sensorAlias = alias(metadata.name)
    return sensorAlias ? `${name}\n${sensorAlias}` : name
  } else {
    return name
  }
}

const metadata = (name: string) => {
  return (props.device.lastEvent?.metadatas ?? []).find((m) => m.variableName === name)
}

const unit = (name: string) => {
  const metadata = (props.device.lastEvent?.metadatas ?? []).find((m) => m.variableName === name)
  if (!metadata) return ''
  switch (metadata.ty) {
    case MeasurementType.Percentage:
      return '%'
    case MeasurementType.RawAnalogRead:
      return ''
    case MeasurementType.FloatCelsius:
      return 'ºC'
  }
}

function formatDecimalPlaces(value: number) {
  const decimalPlaces = Math.max((value.toString().split('.')[1]?.length ?? 1) - 1, 0)
  return value.toFixed(Math.min(decimalPlaces, 2))
}
</script>
<style lang="scss" scoped>
.box {
  border: solid 1px #626262;
  padding: 20px;
  height: min-content;
}
.measurements,
.box {
  max-width: 25vw;
}
</style>
