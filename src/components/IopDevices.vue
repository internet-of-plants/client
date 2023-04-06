<template>
  <div class="flex flex-col items-center">
    <Name v-model="collectionName" @blur="saveName()" @toggle-edit="editing = $event" />

    <div v-if="collection" class="devices flex pt-4">
      <!-- Eventually show more details here, like the ammount of devices/devices, the time of the
          last event, if there are any unsolved panics... -->
      <div v-for="d in collection.devices" :key="d.id" class="ml-4 box">
        <router-link
          :to="`/organization/${organizationId}/collection/${collection.id}/device/${d.id}`"
        >
          <DeviceCard :device="d" />
        </router-link>
      </div>
    </div>

    <Upload
      v-if="collection && parsedOrganizationId"
      :organization-id="parsedOrganizationId"
      :collection="collection"
      :editing="editing"
      @refresh="load"
      class="mr-7 mt-5"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import Name from '@/atoms/IopName.vue'
import DeviceCard from '@/components/DeviceCard.vue'
import Upload from '@/atoms/IopUpload.vue'
import CollectionService from '@/api/collection'
import type { Collection } from '@/models'
import router from '@/router'

const editing = ref(false)
const { organizationId, collectionId } = useRoute().params
const parsedOrganizationId = ref<number | null>(null)
try {
  parsedOrganizationId.value = parseInt(organizationId as string)
} catch (_err) {
  router.push({ path: '/' })
}
const parsedCollectionId = ref<number | null>(null)
try {
  parsedCollectionId.value = parseInt(collectionId as string)
} catch (_err) {
  router.push({ path: '/' })
}

const collectionName = ref<string | null>(null)

const collection = ref<Collection | null>(null)

const saveName = async () => {
  if (!collection.value || !collectionName.value || collectionName.value === collection.value.name)
    return

  await CollectionService.setName({
    collectionId: collection.value.id,
    name: collectionName.value
  })
}

const load = async () => {
  if (!parsedCollectionId.value) throw new Error('invalid collection')

  collection.value = await CollectionService.find({
    collectionId: parsedCollectionId.value
  })
  collectionName.value = collection.value.name

  if (collection.value.devices.length === 0) {
    router.push({ path: `/organization/${organizationId}` })
  } else if (collection.value.devices.length === 1) {
    router.push({
      path: `/organization/${organizationId}/collection/${collectionId}/device/${collection.value.devices[0].id}`
    })
  }
}

onMounted(load)
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
