import type { DeviceLog } from "@/models";
import * as HTTP from "@/http";

export interface DeviceContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
}

async function list(ctx: DeviceContext,limit = 3): Promise<DeviceLog[]> {
  return await HTTP.get(`/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/log/last/${limit}`);
}

const LogService = {
  list,
};
export default LogService;
