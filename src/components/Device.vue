<template>
  <div class="flex flex-col w-full items-center m-10">
    <button class="right" @click="editing = !editing">
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

    <DeviceMetadata
      v-if="device"
      :organization-id="parseOrganizationId"
      :collection-id="parseCollectionId"
      :editing="editing"
      :device="device"
    />

    <Panics
      v-if="panics && device"
      :panics="panics"
      :organizationId="parseOrganizationId"
      :collectionId="parseCollectionId"
      :deviceId="device.id"
    />

    <Upload
      v-if="device"
      :organization-id="parseOrganizationId"
      :collection-id="parseCollectionId"
      :device="device"
      :editing="editing"
      @refresh="load"
    />

    <Logs v-if="logs" :logs="logs" />

    <EventHistory
      v-if="events && device"
      :device="device"
      :history="events"
      :show-stale="(device.compiler?.sensors?.length ?? 0) == 0"
    />
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
import EventService from "@/api/event";

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
const events = ref(undefined);

const load = async () => {
  device.value = await DeviceService.find({
    organizationId,
    collectionId,
    deviceId,
  });
  document.title = `${device.value.name ?? device.value.mac}`;
};

onMounted(async () => {
  await load();

  logs.value = await LogService.list({
    organizationId,
    collectionId,
    deviceId,
  });

  panics.value = await PanicService.list({
    organizationId,
    collectionId,
    deviceId,
  });

  events.value = await EventService.list({
    organizationId,
    collectionId,
    deviceId,
    limit: 500,
  });
});
</script>

<style scoped lang="scss">
a {
  color: #42b983;
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
</style>
