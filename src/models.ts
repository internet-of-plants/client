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
  build_flags: string;
  platform: string;
  framework: string | null;
  platform_packages: string;
  extra_platformio_params: string;
  ldf_mode: string | null;
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
  Unknown = "Unknown"
}

export interface Measurement {
  name: string;
  humanName: string;
  value: string;
  ty: MeasurementType;
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
  measurements: Measurement[];
  configuration_requests: ConfigRequest[];
}

export interface Collection {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description: string | null;
  mac: string;
  firmware_id: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  measurements: unknown;
  metadatas: Measurement[];
  createdAt: string;
  updatedAt: string;
}

export interface DeviceView {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
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

export interface CollectionView {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description: string | null;
  devices: Device[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description: string | null;
  collections: Array<Collection>;
  members: Array<string>; // username
  createdAt: string;
  updatedAt: string;
}

export interface DeviceLog {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  log: string;
  created_at: string;
}

export interface DevicePanic {
  id: number;
  file: string;
  line: number;
  function: string;
  msg: string;
  created_at: string;
  updated_at: string;
}

export interface Dataset {
  label: string;
  yAxisID?: string;
  backgroundColor: string;
  data: number[];
}

//export interface Chart {
//  labels: string[];
//  datasets: Dataset[];
//}
//
//export interface YAxes {
//  type: string;
//  id: string;
//  position?: string;
//  ticks: {
//    callback(value: number): string;
//    min: number;
//    max?: number;
//  };
//}

export interface Firmware {
  id: number;
  hash: string;
}

//export interface ChartOptions {
//  responsive: boolean;
//  maintainAspectRatio: boolean;
//  scales: {
//    yAxes: YAxes[];
//  };
//}
