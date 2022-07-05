<template>
  <div
    v-if="organization"
    class="flex flex-row justify-evenly w-full p-20 flex-wrap grid-cols-3 grid"
  >
    <div
      v-for="c in organization.collections"
      :key="c.id"
      class="flex flex-row flex-wrap border m-1"
    >
      <template v-if="c.devices.length === 1">
        <span
          v-for="device in [...c.devices.slice(0, 1)]"
          :key="device.id"
          class="w-full p-3"
        >
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
                  device.firmware.hash === device.compiler?.latestFirmware.hash
                "
                :title="`Firmware MD5: ${device.firmware.hash}`"
              >
                Device Up to Date
              </p>
              <p
                v-else
                :title="`Current Firmware MD5: ${device.firmware.hash}\nUpdate's Firmware MD5: ${device.compiler?.latestFirmware.hash}`"
              >
                Update Available
              </p>
            </div>
          </router-link>
        </span>
      </template>
      <div v-else class="flex flex-col">
        <router-link
          :to="`/organization/${organization.id}/collection/${c.id}`"
          class="w-full"
        >
          <h4 v-if="c.devices.length > 1">{{ c.name }}</h4>
          <p v-if="c.devices.length > 1 && c.description">
            {{ c.description }}
          </p>
          <span
            >{{ c.devices.length }} Device{{
              c.devices.length === 1 ? "" : "s"
            }}</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import OrganizationService from "@/api/organization";
import LogService from "@/api/log";
import PanicService from "@/api/panic";
import router from "@/router";
import DeviceCard from "@/components/DeviceCard.vue";
import Logs from "@/atoms/Logs.vue";
import Panics from "@/atoms/Panics.vue";

const { organizationId } = useRoute().params;
const organization = ref(undefined);

const logs = ref({});
const panics = ref({});

onMounted(async () => {
  organization.value = await OrganizationService.find(organizationId);
  if (organization.value.collections.length === 0) {
    //router.push({ path: "/" });
  } else if (organization.value.collections.length === 1) {
    router.push({
      path: `/organization/${organizationId}/collection/${organization.value.collections[0].id}`,
    });
  }

  for (const collection of organization.value.collections) {
    for (const device of collection.devices) {
      logs.value[device.id] = await LogService.list({
        organizationId,
        collectionId: collection.id,
        deviceId: device.id,
        limit: 1,
      });

      panics.value[device.id] = await PanicService.list({
        organizationId,
        collectionId: collection.id,
        deviceId: device.id,
        limit: 1,
      });
    }
  }
});
</script>

<style scoped lang="scss"></style>
