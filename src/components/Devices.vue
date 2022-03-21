<template>
  <div class="devices" v-if="collection">
    <!-- Eventually show more details here, like the ammount of devices/devices, the time of the
         last event, if there are any unsolved panics... -->
    <div v-for="d in collection.devices" :key="d.id">
      <router-link :to="`/organization/${organizationId}/collection/${collection.id}/device/${d.id}`"
       class="center card">
        <DeviceCard :device="d"/>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CollectionView } from '@/models';
import DeviceCard from '@/components/DeviceCard.vue';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Devices',
  components: {
    DeviceCard,
  },
  setup() {
    const collection = ref<CollectionView | null>(null);
    const { organizationId, collectionId } = useRoute().params;

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        const url = `${config.API_HOST}/v1/organization/${organizationId}/collection/${collectionId}`;
        const response = await fetch(url, { headers: { Authorization: `Basic ${token}` } });

        if (response.status === 403) {
          sessionStorage.removeItem('token');
          router.push({ path: '/login' });
          return;
        }

        collection.value = await response.json();
      })();
    });

    return {
      collection, organizationId,
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

.card { width: 100%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
