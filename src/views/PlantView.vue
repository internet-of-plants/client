<template>
  <div class="plant-view">
    <Plant/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Plant from '@/components/Plant.vue';

export default defineComponent({
  name: 'PlantView',
  components: {
    Plant,
  },
});
</script>
