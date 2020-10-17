<template>
  <div class="home">
    <PlantList />
  </div>
</template>

<script>
// @ is an alias to /src
import PlantList from '@/components/PlantList.vue';

export default {
  name: 'Home',
  components: {
    PlantList,
  },
};
</script>
