import * as HTTP from "@/http";

interface SetAliasContext {
  sensorId: number;
  deviceId: number;
  alias: string;
}

async function setAlias(ctx: SetAliasContext): Promise<void> {
  await HTTP.post("/v1/sensor/alias", ctx);
}

const SensorService = {
  setAlias
};
export default SensorService;
