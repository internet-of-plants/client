<template>
  <div class="sensor-prototypes" v-if="prototypes">
    <div v-for="prototype in prototypes" :key="prototype.id">
      <button @click="createPrototype(prototype.id)">
        Create {{ prototype.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SensorPrototype } from "@/models";
import config from "@/constants";
import router from "@/router";

const token = localStorage.getItem("token") ?? undefined;
if (token === null) {
  router.push({ path: "/" });
}

const targets = ref<Target[]>([]);
const prototypes = ref<SensorPrototype[]>([]);

fetch(`${config.API_HOST}/v1/targets`, {
  headers: { Authorization: `Basic ${token}` }
})
  .then(async req => {
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

fetch(`${config.API_HOST}/v1/sensor/prototypes`, {
  headers: { Authorization: `Basic ${token}` }
})
  .then(async req => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create sensor view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    prototypes.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

const createPrototype = (id: number) => {
  router.push({ path: `/sensor/create/${id}` });
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
