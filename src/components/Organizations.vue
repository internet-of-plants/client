<template>
  <div class="organizations">
    <!-- Eventually show more details here, like the ammount of collections/devices, the time of
         the last event, if there are any unsolved panics... -->
    <div v-for="w in organizations" :key="w.id">
      <router-link :to="`/organization/${w.id}`" class="center card">
       <h4>{{w.name}}</h4>
       <p v-if="w.description">{{w.description}}</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { Organization } from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Organizations',
  setup() {
    const organizations: Array<Organization> = reactive([]);

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        try {
          const response = await fetch(`${config.API_HOST}/v1/organization`, { headers: { Authorization: `Basic ${token}` } });

          if (response.status === 403) {
            sessionStorage.removeItem('token');
            router.push({ path: '/login' });
            return;
          }

          const newOrganization: Array<Organization> = await response.json();
          organizations.push(...newOrganization);
          if (organizations.length === 1) {
            router.push({ path: `/organization/${organizations[0].id}` });
          }
        } catch (err) {
          console.error(err);
        }
      })();
    });

    return {
      organizations,
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

.card { width: 19%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.card p { margin: 0; }
</style>
