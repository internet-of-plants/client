<template>
  <div class="plants">
    <div v-for="e in errors" v-bind:key="e.id">
      <div class="center">
        <h4>{{s.plant_id}}</h4>
        <p>{{s.error}}</p>
        <p>{{formatTime(e.created_at)}}</p>
        <button v-on:click="solveErrorDump(e.id)">Solve</button>
      </div>
    </div>
    <div v-if="status !== undefined">
      <PlantCard
        v-for="s in status"
        v-bind:key="s.plant.id"
        v-bind:status="s" />
    </div>
    <button v-if="status !== undefined" v-on:click="newPlant()">Create New Plant</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Status, ErrorDump } from '@/models';
import PlantCard from '@/components/PlantCard.vue';
import router from '@/router';
import config from '@/constants';

@Component({
  components: { PlantCard },
})
export default class PlantList extends Vue {
  @Prop()
  status?: Status[] = undefined;

  @Prop()
  errors: ErrorDump[] = [];

  interval?: number;

  // eslint-disable-next-line class-methods-use-this
  private getToken(): string | undefined {
    return sessionStorage.getItem('token') ?? undefined;
  }

  private async fetchData(): Promise<void> {
    const token = this.getToken();
    if (token === undefined) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    let response = await fetch(`${config.API_HOST}/plant/index`, { headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    this.status = await response.json();

    response = await fetch(`${config.API_HOST}/error/index`, { headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    this.errors = (await response.json()).value;
  }

  private async newPlant(): Promise<void> {
    const token = this.getToken();
    if (token === undefined) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    const response = await fetch(`${config.API_HOST}/plant`, { method: 'POST', headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    await this.fetchData();
  }

  async mounted() {
    await this.fetchData();
    this.interval = setInterval(() => this.fetchData(), 60000);
  }

  beforeDestroy() {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private async solveErrorDump(id: number): Promise<void> {
    const token = this.getToken();
    if (token === undefined) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    const response = await fetch(`${config.API_HOST}/stacktrace?id=${id}`, { method: 'DELETE', headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    router.go(0);
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

body { width: 100%; margin: 0; padding: 0; }
.center { text-align: center; }
.plants { width: 100%; padding: 0; margin: 0; }
</style>
