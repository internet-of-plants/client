<template>
  <div class="flex flex-col items-center">
    <Name v-model="collectionName" @blur="saveName()" @toggle-edit="editing = $event"/>
    
    <div v-if="collection" class="devices flex pt-4">
      <!-- Eventually show more details here, like the ammount of devices/devices, the time of the
          last event, if there are any unsolved panics... -->
      <div v-for="d in collection.devices" :key="d.id" class="ml-4 box">
        <router-link
          :to="`/organization/${organizationId}/collection/${collection.id}/device/${d.id}`"
        >
          <DeviceCard :device="d" :organization-id="parseOrganizationId" :collection-id="collection.id" />
        </router-link>
      </div>
    </div>

    <Upload
      v-if="collection"
      :organization-id="parseOrganizationId" 
      :collection="collection"
      :editing="editing"
      @refresh="load"
      class="mr-7 mt-5"
    />
  </div>

</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Name from "@/atoms/Name.vue";
import DeviceCard from "@/components/DeviceCard.vue";
import Upload from "@/atoms/Upload.vue";
import CollectionService from "@/api/collection";
import router from "@/router";

const editing = ref(false);
const { organizationId, collectionId } = useRoute().params;
const parseOrganizationId = ref(undefined);
try {
  parseOrganizationId.value = parseInt(organizationId);
} catch (_err) {
  router.push({ path: "/" });
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

const load = async () => {
  collection.value = await CollectionService.find({
    organizationId,
    collectionId,
  });
  collectionName.value = collection.value.name;

  if (collection.value.devices.length === 0) {
    router.push({ path: `/organization/${organizationId}` });
  } else if (collection.value.devices.length === 1) {
    router.push({
      path: `/organization/${organizationId}/collection/${collectionId}/device/${collection.value.devices[0].id}`,
    });
  }
};

onMounted(load);
</script>

<style scoped lang="scss">
.box {
  border: solid 1px #626262;
  padding: 25px;
  height: min-content;
}
a {
  color: inherit !important;
  text-decoration: none;
}
</style>
