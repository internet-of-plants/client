<template>
  <div v-if="!userStore.isAuthenticated" class="signup flex w-full flex-row items-center">
    <div class="w-full flex flex-col items-center p">
      <span class="text-center flex flex-row p-5">If you already have an account, <RouterLink to="/login"><button>Login</button></RouterLink> here</span>
      <div class="items-center flex flex-col w-full">
        <form class="border border-black rounded-sm p-5 flex flex-col" @submit.prevent>
          <div>
            <label for="organization-name">Organization Name:</label>
            <input
              class="float-right ml-2"
              type="text"
              name="organization-name"
              v-model="user.organizationName"
            />
          </div>
          <div class="pt-1">
            <label for="email">Email:</label>
            <input class="float-right ml-2" type="text" name="email" v-model="user.email" />
          </div>
          <div class="pt-1">
            <label for="username">Username:</label>
            <input class="float-right ml-2" type="text" name="username" v-model="user.username" />
          </div>
          <div class="pt-1">
            <label for="password">Password:</label>
            <input class="float-right ml-2" type="password" name="password" v-model="user.password" />
          </div>
          <button class="mt-2" v-on:click="signup()">Signup</button>
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

const userStore = useUserStore()

const user = ref({ email: '', username: '', password: '', organizationName: '' })
if (userStore.isAuthenticated) {
  router.push({ path: '/' })
}

const signup = async () => {
  const token = await UserService.signup({
    email: user.value.email,
    username: user.value.username,
    password: user.value.password,
    organizationName: user.value.organizationName
  })
  localStorage.setItem('token', token)
  window.dispatchEvent(new Event('storage'))
  router.push({ path: '/' })
}
</script>

<style scoped lang="scss">
.signup {
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
