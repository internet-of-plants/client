import * as HTTP from "@/http";
import { Compiler } from "@/models";

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
  collectionId: number;
  deviceId: number | null;
  targetId: number;
  sensors: NewSensor[];
}

export interface ListRequest {
  targetId: number;
  organizationId: number;
}

export interface SetDeviceCompiler {
  deviceId: number;
  compilerId: number;
}
export interface SetCollectionCompiler {
  collectionId: number;
  compilerId: number;
}
export type SetCompiler = SetCollectionCompiler | SetDeviceCompiler;

async function create(request: NewCompiler) {
  await HTTP.post("/v1/compiler", request);
}

async function set(request: SetCompiler) {
  await HTTP.post("/v1/compiler/set", request);
}

async function list(request: ListRequest): Promise<Compiler[]> {
  return await HTTP.get("/v1/compilers", request);
}

const CompilerService = {
  create,
  set,
  list,
};
export default CompilerService;
