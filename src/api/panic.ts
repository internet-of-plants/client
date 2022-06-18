import type { DevicePanic } from "@/models";
import * as HTTP from "@/http";

export interface DeviceContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
}

async function list(
  ctx: DeviceContext,
  limit = 3
): Promise<DevicePanic[]> {
  return await HTTP.get(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/panic/last/${limit}`
  );
}

export interface PanicContext extends DeviceContext {
  panicId: number;
}

async function solve(ctx: PanicContext) {
  await HTTP.post(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/panic/solve/${ctx.panicId}`
  );
}

const PanicService = {
  list,
  solve,
};
export default PanicService;
