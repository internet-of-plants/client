import type { Event } from '@/models'
import * as HTTP from '@/http'

export interface EventListContext {
  deviceId: number
  since: string
}

async function list(ctx: EventListContext): Promise<Event[]> {
  return await HTTP.get('/v1/device/events', ctx)
}

const EventService = {
  list
}
export default EventService
