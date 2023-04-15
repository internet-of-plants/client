import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import OrganizationService from '@/api/organization'
import type { Organization } from '@/models'

export const useOrganizationStore = defineStore('organization', () => {
  const organizations = ref<Organization[] | null>(null)
  async function FETCH_ORGANIZATIONS() {
    organizations.value = await OrganizationService.list()
  }

  return { organizations, FETCH_ORGANIZATIONS }
})
