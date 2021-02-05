<template>
  <div class="plants">
    <div v-for="p in panics" v-bind:key="p.id">
      <div class="center">
        <h4>{{p.plant_id}}</h4>
        <p>{{p.file}}</p>
        <p>{{p.line}}</p>
        <p>{{p.func}}</p>
        <p>{{p.msg}}</p>
        <p>{{formatTime(p.created_at - status.now)}}</p>
        <button v-on:click="solveDevicePanic(p.id)">Solve</button>
      </div>
    </div>

    <div v-for="status in statuses" v-bind:key="status.plant.id">
      <router-link v-bind:to="`/plant/${status.plant.id}`"
          class="plant-card">
        <p><b>Id:&nbsp;</b>{{status.plant.id}}</p>
        <!--<p><b>Name:&nbsp;</b>{{status.plant.name}}</p>-->
        <p v-if="!!status.plant.description"><b>Description:&nbsp;</b>
        {{status.plant.description}}</p>
        <p><b>Created:&nbsp;</b>{{formatTime(status.now - status.plant.created_at)}}&nbsp;ago</p>
        <div v-if="!!status.event">
          <p><b>Air&nbsp;temperature:&nbsp;</b>{{status.event.air_temperature_celsius}}ºC</p>
          <p><b>Air&nbsp;humidity:&nbsp;</b>{{status.event.air_humidity_percentage}}%</p>
          <p><b>Soil&nbsp;temperature:&nbsp;</b>{{status.event.soil_temperature_celsius}}ºC</p>
          <p><b>Soil&nbsp;resistivity:&nbsp;</b>
          {{status.event.soil_resistivity_raw}}&nbsp;raw&nbsp;<small>(0-1200)</small></p>
          <p>Last&nbsp;Event&nbsp;from&nbsp;{{
            formatTime(status.now - status.event.created_at)}}&nbsp;ago</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { Status, DevicePanic } from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'PlantList',
  setup() {
    const statuses: Array<Status> = reactive([]);
    const panics: Array<DevicePanic> = reactive([]);

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        const response = await fetch(`${config.API_HOST}/panic/index`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        const newPanics: Array<DevicePanic> = await response.json();
        panics.push(...newPanics);
      })();

      (async () => {
        const response = await fetch(`${config.API_HOST}/plant/index`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        const newStatuses: Array<Status> = await response.json();
        statuses.push(...newStatuses);
      })();
    });

    const formatTime = (seconds: number): string => {
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
    const solveDevicePanic = async (id: number): Promise<void> => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      const response = await fetch(`${config.API_HOST}/panic?id=${id}`, { method: 'DELETE', headers: { Authorization: `Basic ${token}` } });

      if (response.status === 403) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      router.go(0);
    };

    return {
      statuses, panics, solveDevicePanic, formatTime,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.plant-card { width: 19%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.plant-card p { margin: 0; }
</style>
