<template>
  <div class="collections" v-if="organization">
    <!-- Eventually show more details here, like the last event, if there are unsolved panics.. -->
    <div v-for="c in organization.collections" :key="c.id">
      <router-link :to="`/organization/${organization.id}/collection/${c.id}`" class="card">
        <h4>{{c.name}}</h4>
        <p v-if="c.description">{{c.description}}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from "vue";
import OrganizationService from "@/api/organization";
import router from "@/router";

const { organizationId } = useRoute().params;
const organization = ref(undefined);
onMounted(async () => {
  organization.value = await OrganizationService.find(organizationId);
  if (organization.value.collections.length === 0) {
    //router.push({ path: "/" });
  } else if (organization.value.collections.length === 1) {
    router.push({ path: `/organization/${organizationId}/collection/${organization.value.collections[0].id}` });
  }
});
</script>

<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.card { width: 19%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
