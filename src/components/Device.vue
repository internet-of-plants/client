<template>
  <div class="device" v-if="device">
    <div class="flex">
      <div class="info">
        <p v-if="device.name"><b>Name:&nbsp;</b>{{device.name}}</p>
        <p v-if="device.description"><b>Description:&nbsp;</b>{{device.description}}</p>
        <p><b>MAC:&nbsp;</b>{{device.mac}}</p>
        <p v-if="device.last_update"><b>Newest Update Firmware Version:&nbsp;</b>{{
          device.last_update.version}}</p>
        <!--<p v-if="device.last_update"><b>Newest Update Firmware MD5:&nbsp;</b>{{
          device.last_update.file_hash}}</p>-->
        <p><b>Current Firmware MD5:&nbsp;</b>{{device.file_hash}}</p>
        <p>Device&nbsp;signed&nbsp;up&nbsp;{{
           formatTime(new Date() - new Date(device.created_at))}}&nbsp;ago</p>

        <div v-if="device.last_event">
          <h3>Last Measurement</h3>
          <p><b>Air&nbsp;temperature:&nbsp;</b>{{device.last_event.air_temperature_celsius}}ºC</p>
          <p><b>Air&nbsp;humidity:&nbsp;</b>{{device.last_event.air_humidity_percentage}}%</p>
          <p><b>Soil&nbsp;temperature:&nbsp;</b>{{device.last_event.soil_temperature_celsius}}ºC</p>
          <p><b>Soil&nbsp;resistivity:&nbsp;</b>{{
                device.last_event.soil_resistivity_raw}}&nbsp;raw&nbsp;<small>(0-1200)</small></p>
          <p>Event&nbsp;from&nbsp;{{
             formatTime(new Date() - new Date(device.last_event.created_at))}}&nbsp;ago</p>
        </div>
      </div>
    </div>

    <template v-if="logs.length">
      <h3>Last 3 logs</h3>
      <div v-for="l in logs" :key="l.id">
        <div class="center">
          <p>{{l.log}} - {{formatTime(new Date() - new Date(l.created_at))}} ago</p>
        </div>
      </div>
    </template>

    <div v-for="p in device.panics" :key="p.id">
      <h3>Last 3 unsolved panics</h3>
      <div class="center">
        <p>{{p.file}}</p>
        <p>{{p.line}}</p>
        <p>{{p.func}}</p>
        <p>{{p.msg}}</p>
        <p>Happened&nbsp;{{formatTime(new Date() - new Date(p.created_at))}}&nbsp;ago</p>
        <button v-on:click="solveDevicePanic(p.id)">Solve</button>
      </div>
    </div>

    <h3>Upload new firmware</h3>
    <form class="upload" ref="form" v-on:submit.prevent="uploadBinary">
      <div>
        <label for="version">Version:</label>
        <input type="text" name="version" v-model="version" />
      </div>
      <div>
        <label for="binary">Binary File:</label>
        <input type="file" accept=".bin,.bin.gz" name="binary" />
      </div>
      <button type="submit">Upload New Version</button>
    </form>
    <PlantHistory
      v-if="history"
      :history="history" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import type {
  DeviceLog,
  DeviceView,
  EventHistory,
  DevicePanic,
} from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Device',
  setup() {
    const logs = ref<Array<DeviceLog>>([]);
    const device = ref<DeviceView | null>(null);
    const history = ref<EventHistory | null>(null);
    const form = ref<HTMLFormElement | null>(null);
    const version: string | null = null;

    const panics = ref<Array<DevicePanic>>([]);
    const { organizationId, collectionId, deviceId } = useRoute().params;

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        const response = await fetch(`${config.API_HOST}/v1/organization/${organizationId}/collection/${collectionId}/device/${deviceId}`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        const dev: DeviceView = await response.json();
        document.title = `Device ${dev.name ?? dev.mac}`;
        device.value = dev;
      })();

      (async () => {
        const response = await fetch(`${config.API_HOST}/v1/organization/${organizationId}/collection/${collectionId}/device/${deviceId}/log/last/3`, {
          headers: { Authorization: `Basic ${token}` },
        });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        logs.value = await response.json();
      })();

      (async () => {
        const response = await fetch(`${config.API_HOST}/v1/organization/${organizationId}/collection/${collectionId}/device/${deviceId}/panic/last/3`, {
          headers: { Authorization: `Basic ${token}` },
        });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        panics.value = await response.json();
      })();

      (async () => {
        const secsAgo = 30 * 60;
        const response = await fetch(`${config.API_HOST}/v1/device/history?id=${deviceId}&since_secs_ago=${secsAgo}`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        history.value = await response.json();
      })();
    });

    const formatTime = (milliseconds: number): string => {
      const seconds = Math.floor(milliseconds / 1000);
      if (seconds <= 0) {
        return '00h:00m';
      }

      if (!Number.isFinite(seconds)) {
        return 'Never';
      }

      const hours = Math.floor(seconds / 3600);
      const hoursString = `0${hours}`.slice(-2);

      const minutes = Math.floor((seconds / 60) % 60);
      const minutesString = `0${minutes}`.slice(-2);

      return `${hoursString}h:${minutesString}m`;
    };

    // eslint-disable-next-line class-methods-use-this
    const solveDevicePanic = async (panicId: number): Promise<void> => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      const response = await fetch(`${config.API_HOST}/v1/organization/${organizationId}/collection/${collectionId}/device/${deviceId}/panic/solve/${panicId}`, {
        method: 'POST',
        headers: { Authorization: `Basic ${token}` },
      });

      if (response.status === 403) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      router.go(0);
    };

    const uploadBinary = async () => {
      if (!form?.value) throw new Error('Form is null');
      const body = new FormData(form.value);

      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      const response = await fetch(`${config.API_HOST}/v1/update/${deviceId}`, { method: 'POST', body, headers: { Authorization: `Basic ${token}` } });
      if (response.status === 403) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }
      router.push({ path: '/' });
    };

    return {
      device, history, formatTime, panics, solveDevicePanic, version, uploadBinary, form, logs,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}

body { width: 100%; margin: 0; padding: 0;}
.devices { width: 100%; padding: 0; margin: 0; }
</style>
