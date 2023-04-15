<template>
  <div class="flex flex-col items-center">
    <p
      v-if="organization?.name && organization.collections.length > 1"
      class="text-5xl text-center"
    >
      {{ organization.name }}
    </p>

    <div
      v-if="organization && organization.collections.length > 1"
      class="flex flex-row justify-evenly w-full p-20 flex-wrap grid-cols-3 grid items-center"
    >
      <div
        v-for="c in organization.collections"
        :key="c.id"
        class="flex flex-row flex-wrap border m-1"
      >
        <template v-if="c.devices.length === 1">
          <span v-for="device in [...c.devices.slice(0, 1)]" :key="device.id" class="w-full p-3">
            <router-link
              :to="`/organization/${organizationId}/collection/${c.id}/device/${device.id}`"
            >
              <DeviceCard
                :device="device"
                :organization-id="organization.id"
                :collection-id="c.id"
                :title="`MAC address: ${device.mac}`"
              />

              <Panics
                v-if="panics[device.id]"
                :panics="panics[device.id]"
                :device-id="device.id"
                :organization-id="organization.id"
                :collection-id="c.id"
              />

              <Logs v-if="logs[device.id]" :logs="logs[device.id]" />

              <div class="mt-3">
                <p
                  v-if="
                    device.compiler && device.firmware.hash !== device.compiler.latestFirmware.hash
                  "
                  :title="`Current Firmware MD5: ${device.firmware.hash}\nUpdate's Firmware MD5: ${device.compiler.latestFirmware.hash}`"
                >
                  Update Available
                </p>
              </div>
            </router-link>
          </span>
        </template>
        <div v-else class="flex flex-col">
          <router-link :to="`/organization/${organization.id}/collection/${c.id}`" class="w-full">
            <h4 v-if="c.devices.length > 1">{{ c.name }}</h4>
            <p v-if="c.devices.length > 1 && c.description">
              {{ c.description }}
            </p>
            <span>{{ c.devices.length }} Device{{ c.devices.length === 1 ? '' : 's' }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div v-else-if="organization && organization.collections[0]" class="pt-5 w-full">
      <IopCollection
        :organization-id="organization.id"
        :collection-id="organization.collections[0].id"
      />
    </div>
    <span v-else-if="organization" class="flex flex-col nothing justify-center">
      <div class="text-center">Nothing registered.</div>
      <div class="text-center">Signup through the captive portal opened by the device</div>
    </span>
    <span v-else>
      <div class="text-center w-100">Loading...</div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import type { DevicePanic, DeviceLog, Organization } from '@/models'
import LogService from '@/api/log'
import PanicService from '@/api/panic'
import router from '@/router'
import DeviceCard from '@/components/DeviceCard.vue'
import Logs from '@/atoms/IopLogs.vue'
import Panics from '@/atoms/IopPanics.vue'
import IopCollection from '@/components/IopCollection.vue'
import { useOrganizationStore } from '@/stores/organization'

const { organizationId } = useRoute().params

const organizationStore = useOrganizationStore()
organizationStore.FETCH_ORGANIZATIONS()

const organization = computed(
  () => organizationStore.organizations?.find((o) => `${o.id}` === organizationId) ?? null
)

const logs = ref<Record<number, DeviceLog[]>>({})
const panics = ref<Record<number, DevicePanic[]>>({})

/*
onMounted(async () => {
  for (const collection of organization.value.collections) {
    for (const device of collection.devices) {
      logs.value[device.id] = await LogService.list({
        deviceId: device.id,
        limit: 1
      })

      panics.value[device.id] = await PanicService.list({
        deviceId: device.id,
        limit: 1
      })
    }
  }
})
*/
</script>

<style scoped lang="scss">
.nothing {
  height: 70vh;
}
</style>
