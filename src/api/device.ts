import type { DeviceView } from "@/models";
import * as HTTP from "@/http";

export interface DeviceContext {
  deviceId: number;
}

async function find(ctx: DeviceContext): Promise<DeviceView> {
  return await HTTP.get("/v1/device", ctx);
}

export interface NameUpdateContext extends DeviceContext {
  name: string;
}

async function setName(ctx: NameUpdateContext): Promise<void> {
  await HTTP.post("/v1/device/name", ctx);
}

const DeviceService = {
  find,
  setName,
};
export default DeviceService;
