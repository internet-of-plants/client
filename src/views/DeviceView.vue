<template>
  <div class="device-view">
    <Device/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Device from '@/components/Device.vue';

export default defineComponent({
  name: 'DeviceView',
  components: {
    Device,
  },
});
</script>
