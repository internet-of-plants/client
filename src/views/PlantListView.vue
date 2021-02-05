<template>
  <div class="plants-view">
    <PlantList/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlantList from '@/components/PlantList.vue';

export default defineComponent({
  name: 'PlantListView',
  components: {
    PlantList,
  },
});
</script>
