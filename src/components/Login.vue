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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import config from '@/constants';
import router from '@/router';

@Component
export default class Login extends Vue {
  @Prop()
  private user: { email: string; password: string } = { email: '', password: '' };

  // eslint-disable-next-line class-methods-use-this
  async mounted() {
    if (sessionStorage.getItem('token') !== null) {
      router.push({ path: '/' });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private loginUrl(): string {
    return `${config.API_HOST}/user/login`;
  }

  private async login() {
    const req = await fetch(this.loginUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.user) });
    sessionStorage.setItem('token', await req.text());
    router.push({ path: '/' });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}

body { width: 100%; margin: 0; padding: 0;}
.login { width: 100%; padding: 0; margin: 0; }
</style>
