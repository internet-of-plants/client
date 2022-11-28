<template>
  <div class="flex flex-col items-center">
    <Name v-model="collectionName" @blur="saveName()" />
    
    <div v-if="collection" class="devices flex pt-4">
      <!-- Eventually show more details here, like the ammount of devices/devices, the time of the
          last event, if there are any unsolved panics... -->
      <div v-for="d in collection.devices" :key="d.id" class="pl-4">
        <router-link
          :to="`/organization/${organizationId}/collection/${collection.id}/device/${d.id}`"
        >
          <DeviceCard :device="d" :organization-id="parseOrganizationId" :collection-id="collection.id" />
        </router-link>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Name from "@/atoms/Name.vue";
import DeviceCard from "@/components/DeviceCard.vue";
import CollectionService from "@/api/collection";
import router from "@/router";

const { organizationId, collectionId } = useRoute().params;
const parseOrganizationId = ref(undefined);
try {
  parseOrganizationId.value = parseInt(organizationId);
} catch (_err) {
  //router.push({ path: "/" });
}

const collectionName = ref(null);

const collection = ref(undefined);

const saveName = async () => {
  if (collectionName.value === collection.value.name) return;

  await CollectionService.setName({
    organizationId: parseOrganizationId,
    collectionId: collection.value.id,
    name: collectionName.value,
  });
};

onMounted(async () => {
  collection.value = await CollectionService.find({
    organizationId,
    collectionId,
  });
  collectionName.value = collection.value.name;

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
