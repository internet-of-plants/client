<template>
  <div class="plant-details">
    <h1><router-link v-bind:to="homeUrl()">Home</router-link></h1>
    <div class="flex">
      <div class="info">
        <p><b>Name: </b>{{status.plant.name}}</p>
        <p v-if="!!status.plant.description"><b>Description: </b>{{status.plant.description}}</p>
        <p>Created {{formatTime(createdAgo())}} ago</p>

        <div v-if="!!status.event">
          <p><b>Air&nbsp;temperature:&nbsp;</b>{{status.event.air_temperature_celsius}}ºC</p>
          <p><b>Air&nbsp;humidity:&nbsp;</b>{{status.event.air_humidity_percentage}}%</p>
          <p><b>Soil&nbsp;temperature:&nbsp;</b>{{status.event.soil_temperature_celsius}}ºC</p>
          <p><b>Soil&nbsp;resistivity:&nbsp;</b>
          {{status.event.soil_resistivity_raw}}&nbsp;raw&nbsp;<small>(0-1200)</small></p>
          <p>Event&nbsp;from&nbsp;{{formatTime(status.event.created_at)}}&nbsp;ago</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Status } from '@/models';

@Component
export default class PlantDetails extends Vue {
  @Prop()
  status!: Status;

  // eslint-disable-next-line class-methods-use-this
  private homeUrl(): string {
    return '/';
  }

  private createdAgo(): number {
    return this.status.now - this.status.plant.created_at;
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
  color: #42b983;
}

.info {
  width: 20%;
  margin: -2% 0 0 0;
  padding: 0;
  text-align: left;
}

.flex {
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

body { width: 100%; margin: 0; padding: 0;}
</style>
