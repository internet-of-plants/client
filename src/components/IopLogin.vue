<template>
  <div class="login flex w-full flex-row items-center">
    <div class="items-center flex flex-col w-full">
      <form class="border border-black rounded-sm p-5 flex flex-col" @submit.prevent>
        <div>
          <label for="email">Email:</label>
          <input class="float-right ml-2" type="text" name="email" v-model="user.email" />
        </div>
        <div class="pt-1">
          <label for="password">Password:</label>
          <input class="float-right ml-2" type="password" name="password" v-model="user.password" />
        </div>
        <button class="mt-2" v-on:click="login()">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import config from '@/constants'
import router from '@/router'

const user = reactive({ email: '', password: '' })

if (localStorage.getItem('token') !== null) {
  router.push({ path: '/' })
}

const login = async () => {
  const req = await fetch(`${config.API_HOST}/v1/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (req.status === 200) {
    localStorage.setItem('token', await req.text())
    window.dispatchEvent(new Event('storage'))
  }
  router.push({ path: '/' })
}
</script>

<style scoped lang="scss">
.login {
  height: 60vh;
  margin-bottom: 24vh;
}
</style>
