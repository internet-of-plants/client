<template>
  <div v-if="!userStore.isAuthenticated" class="login flex w-full flex-row items-center">
    <div class="w-full flex flex-col items-center p">
      <span class="text-center flex flex-row p-5">If you don't have an account, <RouterLink to="/signup"><button>Signup</button></RouterLink> here</span>
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
  </div>
</template>

<script setup lang="ts">
import UserService from '@/api/user'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import config from '@/constants'
import router from '@/router'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

const user = ref({ email: '', password: '' })
if (userStore.isAuthenticated) {
  router.push({ path: '/' })
}

const login = async () => {
  const token = await UserService.login({ email: user.value.email, password: user.value.password })
  localStorage.setItem('token', token)
  window.dispatchEvent(new Event('storage'))
  router.push({ path: '/' })
}
</script>

<style scoped lang="scss">
.login {
  height: 60vh;
  margin-bottom: 24vh;
}
a, button {
  color: inherit;
}
a {
  margin: 0 5px;
}
button {
  background-color: #bfbfbf;
  padding: 0 5px;
  border: 1px solid black;
  border-radius: 2px;
}
</style>
