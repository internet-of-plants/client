<template>
  <router-link v-bind:to="plantUrl(status.plant.id)" class="plant-card">
    <p><b>Id:&nbsp;</b>{{status.plant.id}}</p>
    <!-- <p><b>Name:&nbsp;</b>{{status.plant.name}}</p> -->
    <p v-if="!!status.plant.description"><b>Description:&nbsp;</b>{{status.plant.description}}</p>
    <p><b>Created:&nbsp;</b>{{formatTime(createdAgo())}}&nbsp;ago</p>
    <div v-if="!!status.event">
      <p><b>Air&nbsp;temperature:&nbsp;</b>{{status.event.air_temperature_celsius}}ºC</p>
      <p><b>Air&nbsp;humidity:&nbsp;</b>{{status.event.air_humidity_percentage}}%</p>
      <p><b>Soil&nbsp;temperature:&nbsp;</b>{{status.event.soil_temperature_celsius}}ºC</p>
      <p><b>Soil&nbsp;resistivity:&nbsp;</b>
      {{status.event.soil_resistivity_raw}}&nbsp;raw&nbsp;<small>(0-1200)</small></p>
      <p>Event&nbsp;from&nbsp;{{formatTime(status.event.created_at - status.now)}}&nbsp;ago</p>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Status } from '@/models';

@Component
export default class PlantCard extends Vue {
  @Prop()
  status!: Status;

  private createdAgo(): number {
    return this.status.plant.created_at - this.status.now;
  }

  // eslint-disable-next-line class-methods-use-this
  private plantUrl(id: number): string {
    return `/plant/${id}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private formatTime(seconds: number): string {
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
  }
}
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
