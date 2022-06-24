import { SensorPrototype } from "@/models";
import * as HTTP from "@/http";

async function listForTarget(targetId: number): Promise<SensorPrototype[]> {
  return await HTTP.get("/v1/target/sensor/prototypes", { targetId });
}

const SensorPrototypeService = {
  listForTarget,
};
export default SensorPrototypeService;
