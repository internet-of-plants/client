import * as HTTP from "@/http";

export interface NewConfig {
  requestId: number;
  value: string; // encoded the way it will be used by C++
}

export interface NewSensor {
  prototypeId: number;
  alias: string;
  configs: NewConfig[];
}

export interface NewCompiler {
  deviceId: number;
  targetId: number;
  sensors: NewSensor[];
}

async function create(newCompiler: NewCompiler) {
  await HTTP.post("/v1/compiler", newCompiler);
}

const CompilerService = {
  create,
};
export default CompilerService;
