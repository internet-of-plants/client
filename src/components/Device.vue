<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-row">
      <div class="flex flex-col items-center">
        <span class="flex">
          <p
            v-if="device?.name && !editing"
            :title="`Device's MAC address: ${device.mac}`"
            class="text-3xl text-center"
          >
            {{ deviceName }}
          </p>
          <input
            v-else-if="device?.name && editing"
            v-model="deviceName"
            :title="`Device's MAC address: ${device.mac}`"
            class="text-2xl text-center"
            type="text"
            @blur="saveName()"
          />
          
          <button class="right ml-2" @click="editing = !editing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
              />
              <path
                fill-rule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>

        <span class="flex mt-5">
          <Upload
            v-if="device"
            :organization-id="parseOrganizationId"
            :collection-id="parseCollectionId"
            :device="device"
            :editing="editing"
            @refresh="load"
            class="mr-7"
          />

          <span class="flex flex-col">
            <DeviceMetadata
              v-if="device"
              :organization-id="parseOrganizationId"
              :collection-id="parseCollectionId"
              :editing="editing"
              :device="device"
            />
            <Logs v-if="logs" :logs="logs" class="box log-panel mt-7" />
          </span>
        </span>

        <Panics
          v-if="panics && device"
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
import DeviceMetadata from "@/atoms/DeviceMetadata.vue";
import EventHistory from "@/components/EventHistory.vue";
import Upload from "@/atoms/Upload.vue";
import router from "@/router";

import PanicService from "@/api/panic";
import LogService from "@/api/log";
import DeviceService from "@/api/device";

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

const device = ref(undefined);
const logs = ref(undefined);
const panics = ref(undefined);
const deviceName = ref(undefined);

const load = async () => {
  device.value = await DeviceService.find({
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

onMounted(async () => {
  await load();

  logs.value = await LogService.list({
    limit: 200,
    deviceId,
  });

  panics.value = await PanicService.list({
    organizationId,
    collectionId,
    deviceId,
  });
});
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
