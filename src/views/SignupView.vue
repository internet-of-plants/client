<template>
  <div class="signup-view">
    <Signup/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Signup from '@/components/Signup.vue';

export default defineComponent({
  name: 'SignupView',
  components: {
    Signup,
  },
});
</script>
