<template>
  <div class="signup flex w-full flex-row items-center">
    <div class="items-center flex flex-col w-full">
      <div class="border border-black rounded-sm p-5 flex flex-col">
        <div>
          <label for="organization-name">Organization Name:</label>
          <input class="float-right ml-2" type="text" name="organization-name" v-model="user.organizationName" />
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import config from "@/constants";
import router from "@/router";

const user = ref({ email: "", username: "", password: "", organizationName: "" });
if (localStorage.getItem("token") !== null) {
  router.push({ path: "/" });
}

const signup = async () => {
  const req = await fetch(`${config.API_HOST}/v1/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user.value),
  });
  if (req.status === 200) {
    localStorage.setItem("token", await req.text());
    window.dispatchEvent(new Event('storage'))
  }
  router.push({ path: "/" });
};
</script>

<style scoped lang="scss">
.signup {
  height: 60vh;
  margin-bottom: 24vh;
}
</style>
