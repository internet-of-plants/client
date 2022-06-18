<template>
  <div class="compilations" v-if="compilations">
    <div v-for="compilation in compilations" :key="compilation.id">
      <p>Sensors: {{ compilation.compiler.sensorNames.join(", ") }}</p>
      <p>Target: {{ compilation.compiler.targetArch }}</p>

      <p>platformio.ini</p>
      <textarea readonly :value="compilation.platformioIni"></textarea>

      <p>main.cpp</p>
      <textarea readonly :value="compilation.mainCpp"></textarea>

      <p>pin.hpp</p>
      <textarea readonly :value="compilation.pinHpp"></textarea>

      <button @click="compile(compilation.id)">Compile firmware</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Compilation } from "@/models";
import config from "@/constants";
import router from "@/router";

const token = localStorage.getItem("token") ?? undefined;
if (token === null) {
  router.push({ path: "/" });
}

const targets = ref<Target[]>([]);
const compilations = ref<Compilation[]>([]);

fetch(`${config.API_HOST}/v1/targets`, {
  headers: { Authorization: `Basic ${token}` },
})
  .then(async (req) => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create sensor view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    targets.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

fetch(`${config.API_HOST}/v1/compilations`, {
  headers: { Authorization: `Basic ${token}` },
})
  .then(async (req) => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create sensor view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    compilations.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

const compile = async (compilationId: number) => {
  const req = await fetch(`${config.API_HOST}/v1/compilation/${compilationId}`, {
    method: "POST", // TODO: should be put, not post
    headers: {
      Authorization: `Basic ${token}`
    },
  });
  if (req.status === 403) {
    localStorage.removeItem("token");
    router.push({ path: "/login" });
  } else if (req.status === 200) {
    // TODO: create target view page
    router.push({ path: "/" });
  }
  router.push({ path: "/" });
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
}
.plants {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
