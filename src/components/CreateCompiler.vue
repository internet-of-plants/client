<template>
  <div class="create-compiler">
    <p v-if="prototype">Creating Compiler</p>

    <p>Target:</p>
    <select
      v-for="target in targets"
      :key="target.id"
      v-model="newCompiler.targetId"
    >
      <option :value="target.id">{{ target.arch }}</option>
    </select>

    <p>Sensor:</p>
    <div v-for="sensor in sensors" :key="sensor.id">
      <input
        type="checkbox"
        :id="sensor.id"
        :value="sensor.id"
        v-model="newCompiler.sensorIds"
      />
      <label :for="sensor.id">{{ sensor.name }}</label>
    </div>

    <button @click="create">Create</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import config from "@/constants";
import router from "@/router";
import { Target, Sensor } from "@/models";

const targets = ref<Target[]>([]);
const sensors = ref<Sensor[]>([]);

const newCompiler = ref({ sensorIds: [] });

const token = localStorage.getItem("token") ?? undefined;
if (token === null) {
  router.push({ path: "/" });
}

fetch(`${config.API_HOST}/v1/targets`, {
  headers: { Authorization: `Basic ${token}` },
})
  .then(async (req) => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create compiler view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    targets.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

fetch(`${config.API_HOST}/v1/sensors`, {
  headers: { Authorization: `Basic ${token}` },
})
  .then(async (req) => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create compiler view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    sensors.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

const create = async () => {
  const req = await fetch(`${config.API_HOST}/v1/compiler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(newCompiler.value),
  });
  if (req.status === 403) {
    localStorage.removeItem("token");
    router.push({ path: "/login" });
  } else if (req.status === 200) {
    // TODO: create compiler view page
    router.push({ path: "/" });
  }
  router.push({ path: "/" });
};
</script>

<style scoped lang="scss"></style>
