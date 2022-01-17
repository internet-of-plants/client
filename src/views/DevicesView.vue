<template>
  <div class="devices-view">
    <Devices/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Devices from '@/components/Devices.vue';

export default defineComponent({
  name: 'DevicesView',
  components: {
    Devices,
  },
});
</script>
