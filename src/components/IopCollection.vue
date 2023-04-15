<template>
  <div class="flex flex-col items-center w-full">
    <template v-if="collection && collection.devices.length > 1">
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
        v-if="collection && organization"
        :organization-id="organization.id"
        :collection="collection"
        :editing="editing"
        class="mr-7 mt-5"
      />
    </template>
    <template v-else-if="organization && collection && collection.devices[0]">
      <IopDevice
        :organization-id="organization.id"
        :collection-id="collection.id"
        :device-id="collection.devices[0].id"
        class="pl-10"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import Name from '@/atoms/IopName.vue'
import DeviceCard from '@/components/DeviceCard.vue'
import Upload from '@/atoms/IopUpload.vue'
import IopDevice from '@/components/IopDevice.vue'
import CollectionService from '@/api/collection'
import { useOrganizationStore } from '@/stores/organization'
import type { Collection } from '@/models'
import router from '@/router'

const organizationStore = useOrganizationStore()
organizationStore.FETCH_ORGANIZATIONS()

const props = defineProps<{
  organizationId?: number
  collectionId?: number
}>()

const editing = ref(false)
const route = useRoute()

const collectionName = ref<string | null>(null)

const organization = computed(
  () =>
    organizationStore.organizations?.find((o) => {
      if (props.organizationId) return o.id === props.organizationId
      return `${o.id}` === route.params.organizationId
    }) ?? null
)
const collection = computed(
  () =>
    organization.value?.collections.find((c) => {
      if (props.collectionId) return c.id === props.collectionId
      return `${c.id}` === route.params.collectionId
    }) ?? null
)

watch(collection, (c) => {
  if (!c) return

  if (!collectionName.value) {
    collectionName.value = c.name
  }
})

const saveName = async () => {
  if (!collection.value || !collectionName.value || collectionName.value === collection.value.name)
    return

  await CollectionService.setName({
    collectionId: collection.value.id,
    name: collectionName.value
  })
}
</script>

<style scoped lang="scss">
.box {
  border: solid 1px #626262;
  padding: 20px;
  height: min-content;
}
</style>
