import * as HTTP from "@/http";

interface SetAliasContext {
  sensorId: number;
  compilerId: number;
  alias: string;
}

async function setAlias(ctx: SetAliasContext): Promise<void> {
  await HTTP.post("/v1/sensor/set/alias", ctx);
}

const SensorService = {
  setAlias
};
export default SensorService;
