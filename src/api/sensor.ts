import * as HTTP from "@/http";

interface SetAliasContext {
  sensorId: number;
  deviceId: number;
  alias: string;
}

async function setAlias(ctx: SetAliasContext): Promise<void> {
  await HTTP.post("/v1/sensor/alias", ctx);
}

interface SetColorContext {
  sensorId: number;
  deviceId: number;
  color: string;
}

async function setColor(ctx: SetColorContext): Promise<void> {
  await HTTP.post("/v1/sensor/color", ctx);
}
const SensorService = {
  setAlias,
  setColor
};
export default SensorService;
