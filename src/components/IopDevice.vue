<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-row">
      <div v-if="collection" class="flex flex-col items-center">
        <Name
          v-model="deviceName"
          :title="`Device's MAC address: ${device?.mac}`"
          @blur="saveName()"
          @toggle-edit="editing = $event"
        />

        <span class="flex mt-5">
          <Upload
            v-if="device && parsedOrganizationId"
            :organization-id="parsedOrganizationId"
            :collection="collection"
            :deviceId="device.id"
            :editing="editing"
            @refresh="load"
            class="mr-7"
          >
            <template v-slot:description>
              <p v-if="device.firmware.hash === collection.compiler?.latestFirmware.hash">
                <span class="text-sm">
                  Firmware's MD5:
                  {{ device.firmware.hash }}
                </span>
              </p>
              <p
                v-else-if="!!collection.compiler"
                :title="`Current Firmware MD5: ${device.firmware.hash}\nUpdate's Firmware MD5: ${collection.compiler.latestFirmware.hash}`"
                class="text-center"
              >
                Update Available
              </p>
              <p v-else class="text-sm">Firmware's MD5: {{ device.firmware.hash }}</p>
            </template>
          </Upload>

          <span class="flex flex-col">
            <DeviceMetadata
              v-if="device?.lastEvent?.measurements"
              :editing="editing"
              :device="device"
              class="mb-7"
            />
            <Logs v-if="logs.length > 0" :logs="logs" class="box log-panel" />
          </span>
        </span>

        <Panics v-if="panics.length > 0 && device" :panics="panics" :device-id="device.id" />

        <EventHistory
          v-if="device"
          :device="device"
          :collection-id="collection.id"
          :show-stale="(collection.compiler?.sensors.length ?? 0) == 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import type { DevicePanic, DeviceLog, Collection } from '@/models'
import Logs from '@/atoms/IopLogs.vue'
import Panics from '@/atoms/IopPanics.vue'
import Name from '@/atoms/IopName.vue'
import DeviceMetadata from '@/atoms/DeviceMetadata.vue'
import EventHistory from '@/components/EventHistory.vue'
import Upload from '@/atoms/IopUpload.vue'
import router from '@/router'

import PanicService from '@/api/panic'
import LogService from '@/api/log'
import DeviceService from '@/api/device'
import OrganizationService from '@/api/organization'

const editing = ref(false)

const { organizationId, collectionId, deviceId } = useRoute().params

let parsedOrganizationId = ref<number | null>(null)
try {
  parsedOrganizationId.value = parseInt(organizationId as string)
} catch (_err) {
  router.push({ path: '/' })
}

const collection = ref<Collection | null>(null)
const device = computed(() => collection.value?.devices.find((d) => `${d.id}` === deviceId))
const logs = ref<DeviceLog[]>([])
const panics = ref<DevicePanic[]>([])
const deviceName = computed(() => device.value?.name ?? null)

const load = async () => {
  if (!parsedOrganizationId.value) throw new Error('invalid collection')

  const organization = await OrganizationService.find(parsedOrganizationId.value)

  for (const c of organization.collections) {
    if (`${c.id}` !== collectionId) continue
    collection.value = c

    for (const d of c.devices) {
      if (`${d.id}` !== deviceId) continue

      logs.value = await LogService.list({
        limit: 200,
        deviceId: d.id
      })

      panics.value = await PanicService.list({
        deviceId: d.id
      })

      document.title = `${d.name ?? d.mac}`

      break
    }
  }
}

const saveName = async () => {
  if (!device.value || !deviceName.value || deviceName.value === device.value.name) return

  await DeviceService.setName({
    deviceId: device.value.id,
    name: deviceName.value
  })
}

onMounted(load)
</script>

<style scoped lang="scss">
a {
  color: #42b983;
}
.box {
  border: solid 1px #626262;
  padding: 25px;
  height: min-content;
}
body {
  width: 100%;
  margin: 0;
  padding: 0;
}
.devices {
  width: 100%;
  padding: 0;
  margin: 0;
}
.log-panel {
  height: 20em;
  overflow: auto;
}
input {
  background-color: #dfdfdf;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
  height: calc(100% - 2px);
}
</style>
