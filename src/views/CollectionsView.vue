<template>
  <div class="collections-view">
    <Collections/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Collections from '@/components/Collections.vue';

export default defineComponent({
  name: 'CollectionsView',
  components: {
    Collections,
  },
});
</script>
