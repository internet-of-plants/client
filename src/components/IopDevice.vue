<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-row w-full">
      <div v-if="collection" class="flex flex-col items-center">
        <Name
          v-model="deviceName"
          :title="`Device's MAC address: ${device?.mac}`"
          @blur="saveName()"
          @toggle-edit="editing = $event"
        />

        <span class="flex mt-5">
          <Upload
            v-if="device && organization"
            :organization-id="organization.id"
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
              class="mb-5"
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
import { onMounted, ref, computed, watch } from 'vue'
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
import { useOrganizationStore } from '@/stores/organization'

const props = defineProps<{
  organizationId?: number
  collectionId?: number
  deviceId?: number
}>()

const editing = ref(false)
const route = useRoute()

const organizationStore = useOrganizationStore()
organizationStore.FETCH_ORGANIZATIONS()

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
const device = computed(
  () =>
    collection.value?.devices.find((d) => {
      if (props.deviceId) return d.id === props.deviceId
      return `${d.id}` === route.params.deviceId
    }) ?? null
)
const logs = ref<DeviceLog[]>([])
const panics = ref<DevicePanic[]>([])
const deviceName = ref<string | null>(null)

watch(device, async (d) => {
  if (!d) return

  logs.value = await LogService.list({
    limit: 200,
    deviceId: d.id
  })

  panics.value = await PanicService.list({
    deviceId: d.id
  })

  if (!deviceName.value) {
    deviceName.value = d.name
  }

  document.title = d.name ?? d.mac
})

const saveName = async () => {
  if (!device.value || !deviceName.value || deviceName.value === device.value.name) return

  await DeviceService.setName({
    deviceId: device.value.id,
    name: deviceName.value
  })
}

const load = () => {
  organizationStore.FETCH_ORGANIZATIONS()
}
</script>

<style scoped lang="scss">
.box {
  border: solid 1px #626262;
  padding: 20px;
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
  height: 12em;
  overflow: auto;
  max-width: 25vw;
}
input {
  background-color: #dfdfdf;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
  height: calc(100% - 2px);
}
</style>
