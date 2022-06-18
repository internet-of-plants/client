import { SensorPrototype } from "@/models";
import * as HTTP from "@/http";

export interface SensorPrototypeContext {
  organizationId: number;
  collectionId: number;
  deviceId: number;
}

async function listPrototype(ctx: SensorContext): Promise<Sensor[]> {
  return await HTTP.get(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/firmwares`
  );
}
const SensorService = {
  list,
};
export default SensorService;
