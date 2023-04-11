<template>
  <span class="flex flex-col w-full h-full">
    <span class="flex flex-row w-full content-header">
      <SideBar v-if="organizationStore.organizations && organizationStore.organizations.length > 0" />
      <div class="overflow-x-scroll py-10 w-full">
        <RouterView />
      </div>
    </span>
    <div class="flex flex-col w-full footer px-5 border-t border-black pt-3">
      <a href="https://www.flaticon.com/free-icons/soil" title="soil icons"
        >Soil icons created by Smashicons - Flaticon</a
      >
      <a href="https://www.flaticon.com/free-icons/hot" title="hot icons"
        >Hot icons created by Freepik - Flaticon</a
      >
      <a href="https://www.flaticon.com/free-icons/evaporation" title="evaporation icons"
        >Evaporation icons created by Smashicons - Flaticon</a
      >
      <a href="https://www.flaticon.com/free-icons/plant" title="plant icons"
        >Plant icons created by Freepik - Flaticon</a
      >
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useOrganizationStore } from '@/stores/organization'
import SideBar from '@/components/SideBar.vue'
import '@/tailwind.css'

const route = useRoute()
const organizationId = computed(() => route.params.organizationId)
const collectionId = computed(() => route.params.collectionId)
const deviceId = computed(() => route.params.deviceId)

const userStore = useUserStore()
const organizationStore = useOrganizationStore()

const updateAuthenticated = () => {
  userStore.isAuthenticated = !!localStorage.getItem('token')
  if (userStore.isAuthenticated) userStore.FETCH_USER()
}
onMounted(() => window.addEventListener('storage', updateAuthenticated))
onUnmounted(() => window.removeEventListener('storage', updateAuthenticated))

updateAuthenticated();

if (userStore.isAuthenticated) organizationStore.FETCH_ORGANIZATIONS()
if (userStore.isAuthenticated) userStore.FETCH_USER()
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #dfdfdf;
  color: #626262;
  overflow: none;
  height: 100vh;
  padding: 0;
  margin: 0;
}
input {
  background-color: #dfdfdf;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
}
.vc-color-wrap {
  height: 20px !important;
}
a {
  /* color: inherit !important; */
  color: #42b983;
  text-decoration: none;
}
a:hover {
  color: green;
}
</style>

<style scoped lang="scss">
.content-header {
  height: calc(100vh - 7em);
}
.footer {
  height: 7em;
}
</style>
