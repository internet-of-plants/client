<template>
  <div class="flex device info card">
    <p><b>Name:&nbsp;</b>{{device.name}}</p>
    <p><b>MAC:&nbsp;</b>{{device.mac}}</p>
    <p><b>File Hash:&nbsp;</b>{{device.file_hash}}</p>
    <p v-if="device.description"><b>Description:&nbsp;</b>{{device.description}}</p>
    <p>Created at {{formatTime(now() - new Date(device.created_at))}} ago</p>
    <p>Updated at {{formatTime(now() - new Date(device.updated_at))}} ago</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Device } from '@/models';

export default defineComponent({
  name: 'DeviceCard',
  props: {
    device: {
      type: Object as PropType<Device>,
      required: true,
    },
  },
  setup() {
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
    return { formatTime, now };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.card { width: 100%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
