<template>
  <div class="plant">
    <div class="flex">
      <div class="info" v-if="!!data.status">
        <p><b>Name:&nbsp;</b>{{data.status.plant.name}}</p>
        <p v-if="!!data.status.plant.description"><b>Description:&nbsp;</b>{{
          data.status.plant.description}}</p>
        <p>Created {{formatTime(data.status.now - data.status.plant.created_at)}} ago</p>

        <div v-if="!!data.status.event">
          <p><b>Air&nbsp;temperature:&nbsp;</b>{{data.status.event.air_temperature_celsius}}ºC</p>
          <p><b>Air&nbsp;humidity:&nbsp;</b>{{data.status.event.air_humidity_percentage}}%</p>
          <p><b>Soil&nbsp;temperature:&nbsp;</b>{{data.status.event
            .soil_temperature_celsius}}ºC</p>
          <p><b>Soil&nbsp;resistivity:&nbsp;</b>
          {{data.status.event.soil_resistivity_raw}}&nbsp;raw&nbsp;<small>(0-1200)</small></p>
          <p>Event&nbsp;from&nbsp;{{formatTime(data.status.now -
            data.status.event.created_at)}}&nbsp;ago</p>
        </div>
      </div>
    </div>
    <PlantHistory
      v-if="!!data.history"
      v-bind:history="data.history" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { EventHistory, Status } from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Plant',
  setup() {
    const data: {
      status?: Status;
      history?: EventHistory;
    } = reactive({});

    onMounted(async () => {
      const { id } = useRoute().params;
      document.title = `Plant ${id}`;

      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        const secsAgo = 30 * 60;
        const response = await fetch(`${config.API_HOST}/v1/plant/history?id=${id}&since_secs_ago=${secsAgo}`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        data.history = await response.json();
      })();

      (async () => {
        const response = await fetch(`${config.API_HOST}/v1/plant?id=${id}`, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        data.status = await response.json();
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

    return {
      data, formatTime,
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
.plants { width: 100%; padding: 0; margin: 0; }
</style>
