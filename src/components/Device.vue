<template>
  <DeviceMetadata v-if="device" :device="device" />

  <Logs v-if="logs" :logs="logs" />

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
  />

  <EventHistory v-if="events" :history="events" />
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

//const history = ref<EventHistory | null>(null);
//history.value = await HTTP.get(`/v1/device/history?id=${deviceId}&since_secs_ago=${30 * 60}`);

const device = ref(undefined);
const logs = ref(undefined);
const panics = ref(undefined);
const events = ref(undefined);

onMounted(async () => {
  device.value = await DeviceService.find({
    organizationId,
    collectionId,
    deviceId,
  });
  document.title = `Device ${device.value.name ?? device.value.mac}`;

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
    limit: 5000,
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
