import { SensorPrototype } from "@/models";
import * as HTTP from "@/http";

async function listForTarget(id: number): Promise<SensorPrototype[]> {
  return await HTTP.get(`/v1/target/${id}/sensor/prototypes`);
}

const SensorPrototypeService = {
  listForTarget,
};
export default SensorPrototypeService;
