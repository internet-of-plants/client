import type { DevicePanic } from "@/models";
import * as HTTP from "@/http";

export interface DeviceContext {
  deviceId: number;
  limit?: number;
}

async function list(
  ctx: DeviceContext,
): Promise<DevicePanic[]> {
  ctx.limit = ctx.limit ?? 3;
  return await HTTP.get("/v1/device/panics", ctx);
}

export interface PanicContext extends DeviceContext {
  panicId: number;
}

async function solve(ctx: PanicContext) {
  await HTTP.post("/v1/device/panic/solve", ctx);
}

const PanicService = {
  list,
  solve,
};
export default PanicService;
