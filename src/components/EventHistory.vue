<template>
  <span class="mt-3 w-full">
    <select v-model="since">
      <option value="past-1-day">Past Day</option>
      <option value="today">Today</option>
      <option value="past-3-days">Past 3 Days</option>
      <option value="past-7-days">Past 7 Days</option>
      <option value="this-week">This Week</option>
      <option value="past-30-days">Past 30 Days</option>
      <option value="this-month">This Month</option>
    </select>

    <select v-model="interval" class="ml-2">
      <option value="no-filter">No Filter</option>
      <option value="five-minutes">5 Minutes</option>
      <option value="ten-minutes">10 Minutes</option>
      <option value="half-hour">Half Hour</option>
      <option value="one-hour">1 Hour</option>
      <option value="three-hours">3 Hours</option>
      <option value="four-hours">4 Hours</option>
      <option value="six-hours">6 Hours</option>
      <option value="twelve-hours">12 Hours</option>
      <option value="one-day">1 Day</option>
    </select>
    <template v-if="Object.keys(groupedEvents).length">
      <TimelineChart
        v-for="[chartDatas, chartOpts] in charts"
        :data="chartDatas"
        :options="chartOpts"
        class="w-full mt-5 px-40"
        :key="JSON.stringify(chartDatas)"
      />

      <h3 v-if="unableToInferTypes && props.showStale && Object.keys(groupedEvents).length">
        Warning: Unable to infer types, chart will be hard to read
      </h3>
      <h4 v-if="unableToInferTypes && props.showStale && Object.keys(groupedEvents).length">
        Properly configure the device, adding a target and the appropriate sensors to view more
        detailed charts
      </h4>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import TimelineChart from '@/components/TimelineChart.vue'
import type { Device, Measurement, Event } from '@/models'
import { MeasurementType } from '@/models'
import type { ChartData, ChartOptions } from 'chart.js'
import EventService from '@/api/event'

const events = ref<Event[]>([])
const since = ref('past-1-day')
const interval = ref('half-hour')

const pastDays = (days: number) => {
  const d = new Date()
  d.setHours(d.getHours() - days * 24)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d.toISOString()
}

const props = defineProps<{
  device: Device
  showStale: boolean
}>()

const truncateTime = (time: Date, interval: string) => {
  time.setSeconds(0)
  time.setMilliseconds(0)

  let closest = 0
  let index
  switch (interval) {
    case 'no-filter':
      break
    case 'five-minutes':
      for (index = 0; index <= 12; index++) {
        if (Math.abs(index * 5 - time.getMinutes()) < Math.abs(index * 5 - closest)) {
          closest = index * 5
        }
      }
      if (closest == 60) {
        time.setMinutes(0)
        time.setHours(time.getHours() + 1)
      } else {
        time.setMinutes(closest)
      }
      break
    case 'ten-minutes':
      for (index = 0; index <= 6; index++) {
        if (Math.abs(index * 10 - time.getMinutes()) < Math.abs(index * 10 - closest)) {
          closest = index * 10
        }
      }
      if (closest == 60) {
        time.setMinutes(0)
        time.setHours(time.getHours() + 1)
      } else {
        time.setMinutes(closest)
      }
      break
    case 'half-hour':
      for (index = 0; index <= 2; index++) {
        if (Math.abs(index * 30 - time.getMinutes()) < Math.abs(index * 30 - closest)) {
          closest = index * 30
        }
      }
      if (closest == 60) {
        time.setMinutes(0)
        time.setHours(time.getHours() + 1)
      } else {
        time.setMinutes(closest)
      }
      break
    case 'one-hour':
      for (index = 0; index <= 24; index++) {
        if (Math.abs(index - time.getHours()) < Math.abs(index - closest)) {
          closest = index
        }
      }
      if (closest == 24) {
        time.setHours(time.getTime() + 24)
        time.setHours(0)
      } else {
        time.setHours(closest)
        time.setMinutes(0)
      }
      break
    case 'three-hours':
      for (index = 0; index <= 8; index++) {
        if (Math.abs(index * 3 - time.getHours()) < Math.abs(index * 3 - closest)) {
          closest = index * 3
        }
      }
      if (closest == 24) {
        time.setHours(time.getTime() + 24)
        time.setHours(0)
      } else {
        time.setHours(closest)
        time.setMinutes(0)
      }
      break
    case 'four-hours':
      for (index = 0; index <= 6; index++) {
        if (Math.abs(index * 4 - time.getHours()) < Math.abs(index * 4 - closest)) {
          closest = index * 4
        }
      }
      if (closest == 24) {
        time.setHours(time.getTime() + 24)
        time.setHours(0)
      } else {
        time.setHours(closest)
        time.setMinutes(0)
      }
      break
    case 'six-hours':
      for (index = 0; index <= 4; index++) {
        if (Math.abs(index * 6 - time.getHours()) < Math.abs(index * 6 - closest)) {
          closest = index * 6
        }
      }
      if (closest == 24) {
        time.setHours(time.getTime() + 24)
        time.setHours(0)
      } else {
        time.setHours(closest)
        time.setMinutes(0)
      }
      break
    case 'twelve-hours':
      for (index = 0; index <= 2; index++) {
        if (Math.abs(index * 12 - time.getHours()) < Math.abs(index * 12 - closest)) {
          closest = index * 12
        }
      }
      if (closest == 24) {
        time.setHours(time.getTime() + 24)
        time.setHours(0)
      } else {
        time.setHours(closest)
        time.setMinutes(0)
      }
      break
    case 'one-day':
      time.setHours(time.getHours() + 12)
      time.setHours(0)
      time.setMinutes(0)
      break
    default:
      throw new Error('unknown interval: ' + interval)
  }
  return time
}

type NormalizedEvent = {
  createdAt: number
  metadatas: Measurement[]
  measurements: Record<string, string>
  stat: Record<string, string | number | null>
}
type GroupedEvent = {
  createdAt: number
  metadatas: Measurement[]
  measurements: Record<string, number[]>
  stats: Record<string, Array<string | number | null>>
}
const groupedEvents = computed<Record<number, NormalizedEvent>>(() => {
  const group: Record<number, Record<string, GroupedEvent>> = {}
  for (const ev of events.value) {
    const time = truncateTime(new Date(ev.createdAt), interval.value).getTime()
    const subkey = JSON.stringify(ev.metadatas)
    if (!group[time]) group[time] = {}
    if (!group[time][subkey]) {
      group[time][subkey] = {
        createdAt: time,
        metadatas: ev.metadatas,
        measurements: {},
        stats: {}
      }
    }

    for (const [key, value] of Object.entries(ev.measurements)) {
      if (!group[time][subkey].measurements[key]) group[time][subkey].measurements[key] = []
      group[time][subkey].measurements[key].push(value)
    }
    for (const [key, value] of Object.entries(ev.stat)) {
      if (!group[time][subkey].stats[key]) group[time][subkey].stats[key] = []
      group[time][subkey].stats[key].push(value)
    }
  }

  const normalizedGroup: Record<string, NormalizedEvent> = {}
  for (const [time, object] of Object.entries(group)) {
    const normalized: NormalizedEvent = {
      createdAt: 0,
      metadatas: [],
      measurements: {},
      stat: {}
    }

    for (const obj of Object.values(object)) {
      if (!normalized.createdAt) normalized.createdAt = obj.createdAt
      if (normalized.metadatas.length === 0) normalized.metadatas = obj.metadatas

      for (const [key, value] of Object.entries(obj.measurements)) {
        normalized.measurements[key] = formatDecimalPlaces(
          value.reduce((acc, v) => acc + v / value.length, 0)
        )
      }

      for (const [key, value] of Object.entries(obj.stats)) {
        if (typeof value[0] === typeof '' || value[0] === null) {
          normalized.stat[key] = value[0]
          continue
        }

        normalized.stat[key] = formatDecimalPlaces(
          (value as number[]).reduce((acc, v) => acc + v / value.length, 0)
        )
      }
    }

    normalizedGroup[time] = normalized
  }
  const ret: NormalizedEvent[] = Object.values(normalizedGroup)
  ret.sort((a: NormalizedEvent, b: NormalizedEvent) => a.createdAt - b.createdAt)
  return ret
})

onMounted(async () => {
  events.value = await EventService.list({
    deviceId: props.device.id,
    since: pastDays(1)
  })
})

watch(since, async (value) => {
  let start
  const now = new Date()
  switch (value) {
    case 'past-1-day':
      start = pastDays(1)
      break
    case 'today':
      start = pastDays(0)
      break
    case 'past-3-days':
      start = pastDays(3)
      break
    case 'past-7-days':
      start = pastDays(7)
      break
    case 'past-30-days':
      start = pastDays(30)
      break
    case 'this-week':
      start = pastDays(now.getDay())
      break
    case 'this-month':
      start = pastDays(now.getDate())
      break
    default:
      throw new Error('unknown since: ' + value)
  }

  if (!start) throw new Error('failed to get time')
  events.value = await EventService.list({
    deviceId: props.device.id,
    since: start
  })
})

const unableToInferTypes = ref(
  groupedEvents.value
    ? Object.values(groupedEvents.value).every((e: NormalizedEvent) => e.metadatas.length === 0)
    : true
)

const color = (name: string): string | undefined => {
  return props.device.compiler?.sensors.find((s) => s.measurements.find((m) => m.name === name))
    ?.color
}

const alias = (name: string): string | undefined => {
  return props.device.compiler?.sensors.find((s) => s.measurements.find((m) => m.name === name))
    ?.alias
}

const generateColor = () => {
  if (unableToInferTypes.value) {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
  return '#666666'
}

interface Metadata {
  ty: MeasurementType
  name: string
  stat: boolean
  color: string | null
}

const metadatas = computed<Record<string, Metadata>>(() => {
  const obj: Record<string, Metadata> = {}
  // This is horrible
  for (const event of Object.values(groupedEvents.value)) {
    if (event.metadatas.length !== 0) {
      for (const metadata of event.metadatas) {
        if (obj[metadata.variableName]) continue
        const sensorAlias = alias(metadata.name)

        if (!props.showStale && !sensorAlias) continue

        const name = sensorAlias ? `${sensorAlias} - ${metadata.name}` : metadata.name
        obj[metadata.variableName] = {
          ty: metadata.ty,
          name,
          stat: false,
          color: color(metadata.name) ?? metadata.color
        }
      }
    } else {
      if (!props.showStale) continue

      for (const name of Object.keys(event.measurements)) {
        if (obj[name]) continue
        obj[name] = {
          ty: MeasurementType.Unknown,
          name,
          stat: false,
          color: null
        }
      }
    }

    obj['freeDram'] = {
      ty: MeasurementType.Heap,
      name: 'Free DRAM',
      stat: true,
      color: '#fff176'
    }
    if (event.stat.freeIram) {
      obj['freeIram'] = {
        ty: MeasurementType.Heap,
        name: 'Free IRAM',
        stat: true,
        color: '#4cb050'
      }
    }
    obj['freeStack'] = {
      ty: MeasurementType.Stack,
      name: 'Free STACK',
      stat: true,
      color: '#64b5f6'
    }
    obj['biggestDramBlock'] = {
      ty: MeasurementType.Heap,
      name: 'Biggest DRAM Block',
      stat: true,
      color: '#ffab91'
    }
    if (event.stat.biggestIramBlock) {
      obj['biggestIramBlock'] = {
        ty: MeasurementType.Heap,
        name: 'Biggest IRAM Block',
        stat: true,
        color: '#008781'
      }
    }
  }
  return obj
})

const chartOptions = (ty: MeasurementType): ChartOptions => {
  const scales: Record<string, unknown> = {
    x: {
      axis: 'x',
      type: 'linear',
      display: true,
      ticks: {
        callback: (value: string) => {
          return new Date(value).toLocaleString()
        }
      }
    }
  }

  for (const metadata of Object.values(metadatas.value)) {
    if (metadata.ty !== ty) continue

    scales[metadata.ty as string] = {
      axis: 'y',
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        callback: (value: string) => {
          switch (metadata.ty) {
            case MeasurementType.Percentage:
              value = `${value}%`
              break
            case MeasurementType.RawAnalogRead:
              break
            case MeasurementType.FloatCelsius:
              value = `${value}ºC`
              break
            case MeasurementType.Heap:
              value = `${value}B`
              break
            case MeasurementType.Stack:
              value = `${value}B`
              break
          }
          return value
        }
      }
    }
  }
  let text = 'Events'
  switch (ty) {
    case MeasurementType.Percentage:
      text = 'Percentage'
      break
    case MeasurementType.RawAnalogRead:
      text = 'Analog Read (0-1024)'
      break
    case MeasurementType.FloatCelsius:
      text = 'Temperature'
      break
    case MeasurementType.Heap:
      text = 'Heap'
      break
    case MeasurementType.Stack:
      text = 'Stack'
      break
  }

  return {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text
      },
      tooltip: {
        callbacks: {
          title: (context) =>
            new Date(parseInt(context[0].label.replaceAll('.', ''))).toLocaleString(),
          label: (context) => {
            let value = `${context.formattedValue}`
            const field = context.dataset.label
            const metadata = Object.values(metadatas.value).find((m) => m.name === field)
            switch (metadata?.ty) {
              case MeasurementType.Percentage:
                value += '%'
                break
              case MeasurementType.RawAnalogRead:
                break
              case MeasurementType.FloatCelsius:
                value += 'ºC'
                break
              case MeasurementType.Heap:
                value += 'B'
                break
              case MeasurementType.Stack:
                value += 'B'
                break
            }
            return `${metadata?.name ?? field}: ${value}`
          }
        }
      }
    },
    scales
  } as ChartOptions
}

const chartData = (ty: MeasurementType): ChartData => {
  const datasets = []
  const data = groupedEvents.value
  for (const [field, metadata] of Object.entries(metadatas.value)) {
    if (metadata.ty !== ty) continue

    if (!metadata.stat) {
      datasets.push({
        label: metadata.name,
        yAxisID: metadata.ty,
        data,
        backgroundColor: metadata.color ? metadata.color : generateColor(),
        parsing: {
          xAxisKey: `createdAt`,
          yAxisKey: `measurements.${field}`
        }
      })
    } else {
      datasets.push({
        label: metadata.name,
        yAxisID: metadata.ty,
        data,
        backgroundColor: metadata.color ? metadata.color : generateColor(),
        parsing: {
          xAxisKey: `createdAt`,
          yAxisKey: `stat.${field}`
        }
      })
    }
  }

  return {
    datasets
  } as unknown as ChartData<'line'>
}

const charts = computed<[ChartData<'line'>, ChartOptions][]>(() => {
  const types: Set<MeasurementType> = new Set(
    Object.values(groupedEvents.value)
      .flatMap((e) => Object.values(e.metadatas))
      .map((m) => m.ty)
  )
  types.add(MeasurementType.Unknown)
  types.add(MeasurementType.Heap)
  types.add(MeasurementType.Stack)

  const pair = []
  for (const type of types) {
    const data = chartData(type)
    if (data.datasets.length === 0) continue
    pair.push([data, chartOptions(type)])
  }

  return pair as [ChartData<'line'>, ChartOptions][]
})

function formatDecimalPlaces(value: number) {
  const decimalPlaces = Math.max((value.toString().split('.')[1]?.length ?? 1) - 1, 0)
  return value.toFixed(Math.min(decimalPlaces, 2))
}
</script>

<style scoped lang="scss"></style>
