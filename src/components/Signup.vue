<template>
  <div class="signup">
    <div>
      <label for="email">Email:</label>
      <input type="text" name="email" v-model="user.email" />
    </div>
    <div>
      <label for="username">Username:</label>
      <input type="text" name="username" v-model="user.username" />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="user.password" />
    </div>
    <button v-on:click="signup()">Signup</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Signup',
  setup() {
    const user = reactive({ email: '', username: '', password: '' });
    onMounted(() => {
      if (sessionStorage.getItem('token') !== null) {
        router.push({ path: '/' });
      }
    });

    const signup = async () => {
      const req = await fetch(`${config.API_HOST}/v1/user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
      if (req.status === 200) {
        sessionStorage.setItem('token', await req.text());
      }
      router.push({ path: '/' });
    };

    return { user, signup };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}

body { width: 100%; margin: 0; padding: 0;}
.plants { width: 100%; padding: 0; margin: 0; }
</style>
