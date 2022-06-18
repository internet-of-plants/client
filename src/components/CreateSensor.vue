<template>
  <div class="create-sensor">
    <p v-if="prototype">Creating {{ prototype.name }}</p>

    <p>Target</p>
    <div v-for="target in targets" :key="target.id">
      <input
        type="checkbox"
        :id="target.id"
        :value="target.id"
        v-model="targetIds"
      />
      <label :for="target.id">{{ target.arch }}</label>
    </div>

    <p>Configurations needed:</p>
    <template v-if="prototype">
      <div
        v-for="request in prototype.configuration_requests"
        :key="request.id"
      >
        <label>{{ request.name }}</label>
        <Widget :ty="request.ty" v-model="widgetData[request.id]" />
      </div>
      <button @click="create">Create</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { SensorPrototype, WidgetKind, Target } from "@/models";
import Widget from "@/components/Widget.vue";
import config from "@/constants";
import router from "@/router";

const prototype = ref<SensorPrototype | null>(null);
const targets = ref<Target[]>([]);
const targetIds = ref([]);

const { id } = useRoute().params;
const widgetData = ref({});
const newSensor = ref({ prototypeId: parseInt(id) });

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

watch(targetIds, () => {
  if (targetIds.value.length === 0) {
    widgetData.value = {};
    prototype.value = null;
    return;
  }

  const data = new URLSearchParams();
  targetIds.value.forEach(id => data.append("target_id", id));

  fetch(
    `${config.API_HOST}/v1/sensor/prototype/${id}?${data}`,
    {
      headers: { Authorization: `Basic ${token}` },
    }
  )
    .then(async (req) => {
      if (req.status === 403) {
        localStorage.removeItem("token");
        router.push({ path: "/login" });
      } else if (req.status !== 200) {
        throw new Error(await req.text());
      }

      const json = await req.json();
      widgetData.value = {};
      for (const req of json.configuration_requests) {
        widgetData.value[req.id] = [
          WidgetKind.String,
          WidgetKind.Selection,
        ].includes(req.ty.kind)
          ? ""
          : 0;
      }
      prototype.value = json;
    })
    .catch(() => {
      //localStorage.removeItem("token");
      //router.push({ path: "/login" });
    });
});

const create = async () => {
  newSensor.value.configs = Object.entries(widgetData.value).map(
    ([requestId, value]) => {
      return { requestId: parseInt(requestId), value };
    }
  );
  const req = await fetch(`${config.API_HOST}/v1/sensor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(newSensor.value),
  });
  if (req.status === 403) {
    localStorage.removeItem("token");
    router.push({ path: "/login" });
  } else if (req.status === 200) {
    // TODO: create sensor view page
    router.push({ path: "/" });
  }
  router.push({ path: "/" });
};
</script>

<style scoped lang="scss"></style>
