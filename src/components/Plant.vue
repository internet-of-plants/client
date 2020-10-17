<template>
  <div class="plant">
    <PlantDetails
       v-if="status !== undefined"
       v-bind:status="status" />
    <PlantHistory
       v-if="history != undefined"
       v-bind:history="history" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Status, StatusHistory } from '@/models';
import PlantDetails from '@/components/PlantDetails.vue';
import PlantHistory from '@/components/PlantHistory.vue';
import config from '@/constants';
import router from '@/router';

@Component({
  components: { PlantDetails, PlantHistory },
})
export default class Plant extends Vue {
  @Prop()
  status?: Status = undefined;

  @Prop()
  history?: StatusHistory = undefined;

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

    const { id } = this.$route.params;
    const response = await fetch(`${config.API_HOST}/plant?id=${id}`, { headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    this.status = await response.json();

    this.fetchHistory();
  }

  private async fetchHistory(): Promise<void> {
    const token = this.getToken();
    if (token === undefined) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    const { id } = this.$route.params;
    const secsAgo = 30 * 60;
    const response = await fetch(`${config.API_HOST}/plant/history?id=${id}&since_secs_ago=${secsAgo}`, { headers: { Authorization: `Basic ${token}` } });

    if (response.status === 403) {
      sessionStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }

    this.history = await response.json();
  }

  async mounted() {
    const { id } = this.$route.params;
    document.title = `Plant ${id}`;
    await this.fetchData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}

body { width: 100%; margin: 0; padding: 0;}
.plants { width: 100%; padding: 0; margin: 0; }
</style>
