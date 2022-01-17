<template>
  <div class="workspaces">
    <!-- Eventually show more details here, like the ammount of collections/devices, the time of
         the last event, if there are any unsolved panics... -->
    <div v-for="w in workspaces" :key="w.id">
      <router-link :to="`/workspace/${w.id}`" class="center card">
       <h4>{{w.name}}</h4>
       <p v-if="w.description">{{w.description}}</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { Workspace } from '@/models';
import config from '@/constants';
import router from '@/router';

export default defineComponent({
  name: 'Workspaces',
  setup() {
    const workspaces: Array<Workspace> = reactive([]);

    onMounted(async () => {
      const token = sessionStorage.getItem('token') ?? undefined;
      if (token === undefined) {
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return;
      }

      (async () => {
        try {
          const response = await fetch(`${config.API_HOST}/v1/workspace`, { headers: { Authorization: `Basic ${token}` } });

          if (response.status === 403) {
            sessionStorage.removeItem('token');
            router.push({ path: '/login' });
            return;
          }

          const newWorkspace: Array<Workspace> = await response.json();
          workspaces.push(...newWorkspace);
          if (workspaces.length === 1) {
            router.push({ path: `/workspace/${workspaces[0].id}` });
          }
        } catch (err) {
          console.error(err);
        }
      })();
    });

    return {
      workspaces,
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
