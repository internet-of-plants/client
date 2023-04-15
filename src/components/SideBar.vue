<template>
  <div id="nav" v-for="organization in organizationStore.organizations ?? []">
    <RouterLink :to="`/organization/${organization.id}`">
      <div class="link text-xl" :class="selected(organization.id)">
        {{ organization.name }}
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrganizationStore } from '@/stores/organization'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const organizationStore = useOrganizationStore()

if (userStore.isAuthenticated) userStore.FETCH_USER()
if (userStore.isAuthenticated) organizationStore.FETCH_ORGANIZATIONS()

const { user } = storeToRefs(userStore)

const route = useRoute()

watch(user, (u) => {
  if (!u) return

  if (!route.params?.organizationId) {
    router.push({ path: `/organization/${u.defaultOrganization.id}` })
  }
})

const selected = (id: number) => {
  if (`${id}` === route.params.organizationId) return ['selected']
  return []
}
</script>

<style scoped lang="scss">
.link {
  padding: 1.5em 6em;
  text-align: center;
}
.link:hover,
.selected {
  background-color: #bfbfbf;
}
#nav {
  background-color: #dfdfdf;
  border-right: 1px solid black;
  height: 100%;
}
</style>
