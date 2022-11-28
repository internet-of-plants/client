<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-row">
      <div class="flex flex-col items-center">
        <Name v-model="deviceName" :title="`Device's MAC address: ${device?.mac}`" @blur="saveName()" @toggle-edit="editing = $event" />

        <span class="flex mt-5">
          <Upload
            v-if="device && collection"
            :organization-id="parseOrganizationId" 
            :collection="collection"
            :device="device"
            :editing="editing"
            @refresh="load"
            class="mr-7"
          />

          <span class="flex flex-col">
            <DeviceMetadata
              v-if="device?.lastEvent?.measurements"
              :organization-id="parseOrganizationId"
              :collection-id="parseCollectionId"
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
          :collection-id="parseCollectionId"
          :device-id="device.id"
        />

        <EventHistory
          v-if="device"
          :device="device"
          :organization-id="parseOrganizationId"
          :collection-id="parseCollectionId"
          :show-stale="(device.compiler?.sensors?.length ?? 0) == 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
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

let parseCollectionId;
try {
  parseCollectionId = parseInt(collectionId);
} catch (_err) {
  router.push({ path: `/organization/${organizationId}` });
}

const collection = ref(undefined);
const device = ref(undefined);
const logs = ref([]);
const panics = ref([]);
const deviceName = ref(null);

const load = async () => {
  device.value = await DeviceService.find({
    organizationId,
    collectionId,
    deviceId,
  });
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
    collectionId: parseCollectionId,
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
