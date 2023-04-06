import type { Target } from '@/models'
import * as HTTP from '@/http'

async function list(): Promise<Target[]> {
  return await HTTP.get('/v1/targets')
}
const TargetService = {
  list
}
export default TargetService
