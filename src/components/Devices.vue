<template>
  <div v-if="collection" class="devices">
    <!-- Eventually show more details here, like the ammount of devices/devices, the time of the
         last event, if there are any unsolved panics... -->
    <div v-for="d in collection.devices" :key="d.id">
      <router-link
        :to="`/organization/${organizationId}/collection/${collection.id}/device/${d.id}`"
      >
        <DeviceCard :device="d" :organization-id="parseOrganizationId" :collection-id="colllection.id" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import DeviceCard from "@/components/DeviceCard.vue";
import CollectionService from "@/api/collection";
import router from "@/router";

const { organizationId, collectionId } = useRoute().params;
try {
  parseOrganizationId = parseInt(organizationId);
} catch (_err) {
  //router.push({ path: "/" });
}

const collection = ref(undefined);
onMounted(async () => {
  collection.value = await CollectionService.find({
    organizationId,
    collectionId,
  });
  if (collection.value.devices.length === 0) {
    //router.push({ path: `/organization/${organizationId}` });
  } else if (collection.value.devices.length === 1) {
    router.push({
      path: `/organization/${organizationId}/collection/${collectionId}/device/${collection.value.devices[0].id}`,
    });
  }
});
</script>

<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}
</style>
