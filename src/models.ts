export interface Compiler {
  id: number;
  sensors: Sensor[];
  target: Target;
  latestFirmware: Firmware;
}

export interface Compilation {
  id: number;
  compiler: Compiler;
  platformioIni: string;
  mainCpp: string;
  pinHpp: string;
}

export interface Target {
  id: number;
  arch: string;
  buildFlags: string;
  platform: string;
  framework: string | null;
  platformPackages: string;
  extraPlatformioParams: string;
  ldfMode: string | null;
  board: string | null;
}

export interface Board {
  id: number;
  name: string;
}

export interface TargetPrototype {
  id: number;
  arch: string;
  boards: Board[];
}

export enum WidgetKind {
  U8 = "U8",
  U16 = "U16",
  U32 = "U32",
  U64 = "U64",
  F32 = "F32",
  F64 = "F64",
  String = "String",
  Selection = "Selection",
}

export interface ConfigTypeScalar {
  name: string;
  widget: {
    kind: WidgetKind;
    data: never;
  };
}

export interface ConfigTypeSelection {
  name: string;
  widget: {
    kind: WidgetKind.Selection;
    data: string[];
  };
}

export type ConfigType = ConfigTypeSelection | ConfigTypeScalar;

export interface ConfigRequest {
  id: number;
  name: string;
  humanName: string;
  ty: ConfigType;
}

export enum MeasurementKind {
  AirTemperature = "AirTemperature",
  AirHumidity = "AirHumidity",
  SoilTemperature = "SoilTemperature",
  SoilMoisture = "SoilMoisture"
}

export enum MeasurementType {
  Percentage = "Percentage",
  FloatCelsius = "FloatCelsius",
  RawAnalogRead = "RawAnalogRead",
  Heap = "Heap",
  Stack = "Stack",
  Unknown = "Unknown"
}

export interface Measurement {
  name: string;
  humanName: string;
  ty: MeasurementType;
  kind: MeasurementKind;
  color: string;
}

export interface Config {
  requestId: number;
  name: string;
  typeName: string;
  value: string;
}

export interface Sensor {
  id: number;
  name: string;
  alias: string;
  color: string;
  dependencies: string[];
  includes: string[];
  definitions: string[];
  setups: string[];
  configurations: Config[];
  prototype: SensorPrototype;
}

export interface SensorPrototype {
  id: number;
  name: string;
  dependencies: string[];
  includes: string[];
  definitions: string[];
  setups: string[];
  configurationRequests: ConfigRequest[];
}

export interface Event {
  measurements: unknown;
  metadatas: Measurement[];
  stat: DeviceStat;
  createdAt: string;
}

export interface Device {
  id: number;
  name: string;
  description: string | null;
  target: Target | null;
  sensors: Sensor[];
  mac: string;
  fileHash: string;
  lastEvent: Event | null;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  devices: Device[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string | null;
  collections: Array<Collection>;
  members: Array<string>; // username
  createdAt: string;
  updatedAt: string;
}

export interface DeviceLog {
  id: number;
  log: string;
  createdAt: string;
}

export interface DevicePanic {
  id: number;
  file: string;
  line: number;
  function: string;
  msg: string;
  createdAt: string;
}

export interface Dataset {
  label: string;
  yAxisID?: string;
  backgroundColor: string;
  data: number[];
}

export interface Firmware {
  id: number;
  hash: string;
}

export interface DeviceStat {
  version: string;
  timeRunning: number;
  vcc: number;
  freeDram: number;
  freeIram: number | null;
  freeStack: number;
  biggestDramBlock: number;
  biggestIramBlock: number | null;
}

//export interface ChartOptions {
//  responsive: boolean;
//  maintainAspectRatio: boolean;
//  scales: {
//    yAxes: YAxes[];
//  };
//}
