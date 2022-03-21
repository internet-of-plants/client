<template>
  <div class="organizations-view">
    <Organizations/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Organizations from '@/components/Organizations.vue';

export default defineComponent({
  name: 'OrganizationsView',
  components: {
    Organizations,
  },
});
</script>
