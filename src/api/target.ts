import type { Target } from '@/models'
import * as HTTP from '@/http'

interface ListRequest {
  prototypeId: number
}

async function list(req: ListRequest): Promise<Target[]> {
  return await HTTP.get('/v1/targets', req)
}
const TargetService = {
  list
}
export default TargetService
