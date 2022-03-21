<template>
  <div class="collections" v-if="organization">
    <!-- Eventually show more details here, like the last event, if there are unsolved panics.. -->
    <div v-for="c in organization.collections" :key="c.id">
      <router-link :to="`/organization/${organization.id}/collection/${c.id}`" class="center card">
       <!-- Devices length should be at least 1, can we ensure that? -->
       <!--<template v-if="c.devices.length === 1">-->j
         <h4>{{c.name}}</h4>
         <p v-if="c.description">{{c.description}}</p>
       <!--</template>-->
       <!--<div v-for="d in c.devices" :key="d.id">
         <DeviceCard :device="d"/>
       </div>-->
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { OrganizationView } from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Collections',
  setup() {
    const organization = ref<OrganizationView | null>(null);

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        const { organizationId } = useRoute().params;
        const response = await fetch(`${config.API_HOST}/v1/organization/${organizationId}`, {
          headers: { Authorization: `Basic ${token}` },
        });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        const w: OrganizationView = await response.json();
        organization.value = w;
        if (w.collections?.length === 1) {
          router.push({ path: `/organization/${organizationId}/collection/${w.collections[0].id}` });
        }
      })();
    });

    return { organization };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.card { width: 19%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
