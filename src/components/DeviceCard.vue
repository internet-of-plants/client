<template>
  <div class="flex device info card">
    <p><b>Name:&nbsp;</b>{{props.device.name}}</p>
    <p><b>MAC:&nbsp;</b>{{props.device.mac}}</p>
    <p v-if="props.device.description"><b>Description:&nbsp;</b>{{props.device.description}}</p>
    <p>Created at {{formatTime(now() - new Date(props.device.createdAt))}} ago</p>
    <p>Updated at {{formatTime(now() - new Date(props.device.updatedAt))}} ago</p>
  </div>
</template>

<script setup lang="ts">
import { Device } from '@/models';

const props = defineProps<{
  device: Device;
}>();

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds <= 0) {
    return '00h:00m';
  }

  if (!Number.isFinite(seconds)) {
    return 'Never';
  }

  const hours = Math.floor(seconds / 3600);
  const hoursString = `0${hours}`.slice(-2);

  const minutes = Math.floor((seconds / 60) % 60);
  const minutesString = `0${minutes}`.slice(-2);

  return `${hoursString}h:${minutesString}m`;
};
const now = () => new Date();
</script>

<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.card { width: 100%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
