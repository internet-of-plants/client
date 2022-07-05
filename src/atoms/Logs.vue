<template>
  <template v-if="props.logs.length > 0">
    <h3 v-if="props.logs.length > 1">Last {{ props.logs.length }} logs</h3>
    <div v-for="l in props.logs" :key="l.id">
      <p><span v-if="props.logs.length == 1">Last log: </span>{{ l.log }} - <Time :moment="l.created_at" /></p>
    </div>
  </template>
</template>

<script setup lang="ts">
import { DeviceLog } from "@/models";
import Time from "@/atoms/Time.vue";

const props = defineProps<{
  logs: DeviceLog[];
}>();
</script>
