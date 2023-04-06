<template>
  <span v-if="props.logs.length > 0">
    <h3 v-if="props.logs.length > 1" class="text-center">Last {{ props.logs.length }} logs</h3>
    <h3 v-else>Last log:</h3>
    <div class="flex flex-col-reverse">
      <div v-for="l in logs" :key="l.id">
        <p v-if="l.log !== ''">{{ l.createdAt ? time(l.createdAt) : '' }} {{ l.log }}</p>
        <br v-else />
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DeviceLog } from '@/models'

const props = defineProps<{
  logs: DeviceLog[]
}>()

const time = (date: string) => {
  return new Date(date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })
}

const logs = computed(() => {
  const output = []
  let currentDay
  for (const log of props.logs) {
    const day = new Date(log.createdAt)
    day.setHours(0, 0, 0, 0)

    if (day.toDateString() !== currentDay?.toDateString()) {
      if (currentDay) {
        output.push({
          id: currentDay.toLocaleString(),
          log: currentDay.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric' })
        })
        output.push({
          id: currentDay.toLocaleString() + 'space',
          log: '',
          createdAt: null
        })
      }
      currentDay = day
    }
    output.push(log)
  }

  if (!currentDay) return []

  output.push({
    id: currentDay.toLocaleString(),
    log: currentDay.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric' })
  })
  return output
})
</script>
