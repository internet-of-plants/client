<template>
  <div class="organizations" v-if="organizations">
    <!-- Eventually show more details here, like the ammount of collections/devices, the time of
         the last event, if there are any unsolved panics... -->
    <div v-for="o in organizations" :key="o.id">
      <router-link :to="`/organization/${o.id}`" class="card">
        <h4>{{ o.name }}</h4>
        <p v-if="o.description">{{ o.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganizationService from "@/api/organization";
import { onMounted, ref } from "vue";
import router from "@/router";

const organizations = ref(undefined);
onMounted(async () => {
  organizations.value = await OrganizationService.list();
  if (organizations.value.length === 1) {
    router.push({ path: `/organization/${organizations.value[0].id}` });
  }
});
</script>

<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.card {
  width: 19%;
  margin: 0;
  padding: 0;
  display: inline-block;
  word-wrap: anywhere;
}
.card p {
  margin: 0;
}
</style>
