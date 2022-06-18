import type { Event } from "@/models";
import * as HTTP from "@/http";

export interface EventListContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
  limit: number;
}

async function list(ctx: EventListContext): Promise<Event[]> {
  return await HTTP.get(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/events/${ctx.limit}`
  );
}

const EventService = {
  list
};
export default EventService;
