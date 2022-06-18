import type { DeviceView } from "@/models";
import * as HTTP from "@/http";

export interface DeviceContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
}

async function find(ctx: DeviceContext): Promise<DeviceView> {
  return await HTTP.get(
  `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}`);
}

const DeviceService = {
  find
};
export default DeviceService;
