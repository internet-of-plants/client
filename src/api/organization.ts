import type { Organization } from '@/models'
import * as HTTP from '@/http'

async function list(): Promise<Organization[]> {
  return await HTTP.get('/v1/organizations')
}

const OrganizationService = {
  list
}
export default OrganizationService
