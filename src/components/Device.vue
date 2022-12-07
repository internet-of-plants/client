<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-row">
      <div v-if="collection" class="flex flex-col items-center">
        <Name v-model="deviceName" :title="`Device's MAC address: ${device?.mac}`" @blur="saveName()" @toggle-edit="editing = $event" />

        <span class="flex mt-5">
          <Upload
            v-if="device"
            :organization-id="parseOrganizationId" 
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
              <p v-else class="text-sm">Firmware's MD5: {{device.firmware.hash}}</p>
            </template>
          </Upload>

          <span class="flex flex-col">
            <DeviceMetadata
              v-if="device?.lastEvent?.measurements"
              :organization-id="parseOrganizationId"
              :collection-id="collection.id"
              :editing="editing"
              :device="device"
              class="mb-7"
            />
            <Logs v-if="logs.length > 0" :logs="logs" class="box log-panel" />
          </span>
        </span>

        <Panics
          v-if="panics.length > 0 && device"
          :panics="panics"
          :organization-id="parseOrganizationId"
          :collection-id="collection.id"
          :device-id="device.id"
        />

        <EventHistory
          v-if="device"
          :device="device"
          :organization-id="parseOrganizationId"
          :collection-id="collection.id"
          :show-stale="(collection.compiler?.sensors.length ?? 0) == 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import Logs from "@/atoms/Logs.vue";
import Panics from "@/atoms/Panics.vue";
import Name from "@/atoms/Name.vue";
import DeviceMetadata from "@/atoms/DeviceMetadata.vue";
import EventHistory from "@/components/EventHistory.vue";
import Upload from "@/atoms/Upload.vue";
import router from "@/router";

import PanicService from "@/api/panic";
import LogService from "@/api/log";
import DeviceService from "@/api/device";
import CollectionService from "@/api/collection";

const editing = ref(false);

const { organizationId, collectionId, deviceId } = useRoute().params;

let parseOrganizationId;
try {
  parseOrganizationId = parseInt(organizationId);
} catch (_err) {
  router.push({ path: "/" });
}

const collection = ref(undefined);
const device = computed(() => collection.value?.devices.find((d) => `${d.id}` === deviceId));
const logs = ref([]);
const panics = ref([]);
const deviceName = ref(null);

const load = async () => {
  collection.value = await CollectionService.find({
    organizationId,
    collectionId,
  });
  logs.value = await LogService.list({
    limit: 200,
    deviceId,
  });

  panics.value = await PanicService.list({
    organizationId,
    collectionId,
    deviceId,
  });
  deviceName.value = device.value.name;
  document.title = `${device.value.name ?? device.value.mac}`;
};

const saveName = async () => {
  if (deviceName.value === device.value.name) return;

  await DeviceService.setName({
    organizationId: parseOrganizationId,
    collectionId: collection.value.id,
    deviceId: device.value.id,
    name: deviceName.value,
  });
};

onMounted(load);
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
  background-color: #DFDFDF;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
  height: calc(100% - 2px);
}
</style>
