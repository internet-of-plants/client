<template>
  <template v-if="props.panics.length > 0">
    <h3>Last {{ props.panics.length }} unsolved panics</h3>
    <div v-for="p in props.panics" :key="p.id">
      <p>{{ p.file }}</p>
      <p>{{ p.line }}</p>
      <p>{{ p.func }}</p>
      <p>{{ p.msg }}</p>
      <p>Happened <Time :moment="p.createdAt" /></p>
      <button v-on:click="solveDevicePanic(p.id)">Solve</button>
    </div>
  </template>
</template>

<script setup lang="ts">
import PanicService from '@/api/panic'
import Time from '@/atoms/IopTime.vue'
import type { DevicePanic } from '@/models'
import router from '@/router'

const props = defineProps<{
  panics: DevicePanic[]
  deviceId: number
}>()

const solveDevicePanic = async (panicId: number): Promise<void> => {
  await PanicService.solve({
    deviceId: props.deviceId,
    panicId
  })

  router.go(0)
}
</script>
