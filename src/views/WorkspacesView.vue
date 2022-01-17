<template>
  <div class="workspaces-view">
    <Workspaces/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Workspaces from '@/components/Workspaces.vue';

export default defineComponent({
  name: 'WorkspacesView',
  components: {
    Workspaces,
  },
});
</script>
