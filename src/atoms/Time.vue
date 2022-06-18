<template>
  {{ formatTime(new Date() - new Date(props.moment)) }}&nbsp;ago
</template>

<script setup lang="ts">
const props = defineProps<{
  moment: Date | number | string;
}>();

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds <= 0) {
    return "00h:00m";
  }

  if (!Number.isFinite(seconds)) {
    return "Never";
  }

  const hours = Math.floor(seconds / 3600);
  const hoursString = `0${hours}`.slice(-2);

  const minutes = Math.floor((seconds / 60) % 60);
  const minutesString = `0${minutes}`.slice(-2);

  return `${hoursString}h:${minutesString}m`;
};
</script>
