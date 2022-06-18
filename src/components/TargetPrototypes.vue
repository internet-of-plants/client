<template>
  <div class="target-prototypes" v-if="prototypes">
    <div v-for="prototype in prototypes" :key="prototype.id">
      <button
        v-for="board in prototype.boards"
        :key="board.id"
        @click="create(board.id)"
      >
        Create {{ prototype.arch }} {{ board.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TargetPrototype } from "@/models";
import config from "@/constants";
import router from "@/router";

const prototypes = ref<TargetPrototype[]>([]);

const token = localStorage.getItem("token") ?? undefined;
if (token === null) {
  router.push({ path: "/" });
}
fetch(`${config.API_HOST}/v1/target/prototypes`, {
  headers: { Authorization: `Basic ${token}` },
})
  .then(async (req) => {
    if (req.status === 403) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    } else if (req.status !== 200) {
      // TODO: create target view page
      throw new Error(await req.text());
    }

    const json = await req.json();
    prototypes.value = json;
  })
  .catch(() => {
    //localStorage.removeItem("token");
    //router.push({ path: "/login" });
  });

const create = async (boardId: number) => {
  const req = await fetch(`${config.API_HOST}/v1/target`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`
    },
    body: JSON.stringify({ boardId })
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
