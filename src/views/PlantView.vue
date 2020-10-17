<template>
  <div class="plant-view">
    <Plant />
  </div>
</template>

<script>
// @ is an alias to /src
import Plant from '@/components/Plant.vue';

export default {
  name: 'PlantView',
  components: {
    Plant,
  },
};
</script>
