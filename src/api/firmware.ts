import { Firmware } from "@/models";
import * as HTTP from "@/http";

export interface FirmwareContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
}

async function list(ctx: FirmwareContext): Promise<Firmware[]> {
  return await HTTP.get(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/firmwares`
  );
}
const FirmwareService = {
  list,
};
export default FirmwareService;
