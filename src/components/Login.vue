<template>
  <div class="login">
    <div>
      <label for="email">Email:</label>
      <input type="text" name="email" v-model="user.email" />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="user.password" />
    </div>
    <button v-on:click="login()">Login</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import config from '@/constants';
import router from '@/router';

const user = reactive({ email: '', password: '' });

if (localStorage.getItem('token') !== null) {
  router.push({ path: '/' });
}

const login = async () => {
  const req = await fetch(`${config.API_HOST}/v1/user/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
  if (req.status === 200) {
    localStorage.setItem('token', await req.text());
  }
  router.push({ path: '/' });
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
