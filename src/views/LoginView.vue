<template>
  <div class="login-view">
    <Login/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Login from '@/components/Login.vue';

export default defineComponent({
  name: 'LoginView',
  components: {
    Login,
  },
});
</script>
