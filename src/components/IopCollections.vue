<template>
  <div class="flex flex-col items-center">
    <p v-if="organization?.name" class="text-3xl text-center">
      {{ organization.name }}
    </p>

    <div
      v-if="organization"
      class="flex flex-row justify-evenly w-full p-20 flex-wrap grid-cols-3 grid items-center"
    >
      <div v-for="c in collections" :key="c.id" class="flex flex-row flex-wrap border m-1">
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import type { DevicePanic, DeviceLog, Organization } from '@/models'
import OrganizationService from '@/api/organization'
import LogService from '@/api/log'
import PanicService from '@/api/panic'
import router from '@/router'
import DeviceCard from '@/components/DeviceCard.vue'
import Logs from '@/atoms/IopLogs.vue'
import Panics from '@/atoms/IopPanics.vue'

const { organizationId } = useRoute().params

let parsedOrganizationId: number
try {
  parsedOrganizationId = parseInt(organizationId as string)
} catch (_err) {
  router.push({ path: '/' })
}

const organization = ref<Organization | null>(null)

const logs = ref<Record<number, DeviceLog[]>>({})
const panics = ref<Record<number, DevicePanic[]>>({})

const collections = computed(
  () => organization.value?.collections.filter((c) => c.devices.length > 0) ?? []
)

onMounted(async () => {
  organization.value = await OrganizationService.find(parsedOrganizationId)
  if (collections.value.length === 0) {
    router.push({
      path: `/`
    })
  }
  if (collections.value.length === 1) {
    router.push({
      path: `/organization/${organizationId}/collection/${collections.value[0].id}`
    })
  }

  for (const collection of collections.value) {
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
</script>

<style scoped lang="scss"></style>
