import type { DeviceLog } from '@/models'
import * as HTTP from '@/http'

export interface DeviceContext {
  deviceId: number
  limit?: number
}

async function list(ctx: DeviceContext): Promise<DeviceLog[]> {
  ctx.limit = ctx.limit ?? 3
  return await HTTP.get('/v1/device/logs', ctx)
}

const LogService = {
  list
}
export default LogService
