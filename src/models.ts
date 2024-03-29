export interface Compiler {
  id: number
  sensors: Sensor[]
  deviceConfigs: DeviceConfig[]
  collectionName: string
  devicesCount: number
  target: Target
  latestFirmware: Firmware
  latestCompilation: Compilation
}

export interface DeviceConfig {
  requestId: number
  name: string
  typeName: string
  value: string
}

export interface Compilation {
  id: number
  platformioIni: string
  mainCpp: string
  pinHpp: string
}

export interface Target {
  id: number
  arch: string
  buildFlags: string
  platform: string
  framework: string | null
  platformPackages: string
  extraPlatformioParams: string
  ldfMode: string | null
  board: string | null
  configurationRequests: DeviceConfigRequest[]
}

export interface DeviceConfigRequest {
  id: number
  variableName: string
  name: string
  secretAlgo: SecretAlgo | null
  ty: DeviceConfigType
}

export interface DeviceConfigType {
  name: string
  widget: DeviceWidgetKind
}

export enum SecretAlgo {
  LibsodiumSealedBox = 'LibsodiumSealedBox'
}

export enum DeviceWidgetKind {
  SSID = 'SSID',
  PSK = 'PSK',
  Timezone = 'Timezone'
}

export interface Board {
  id: number
  name: string
}

export interface TargetPrototype {
  id: number
  arch: string
  boards: Board[]
}

export enum SensorWidgetKind {
  Seconds = 'Seconds',
  U8 = 'U8',
  U16 = 'U16',
  U32 = 'U32',
  U64 = 'U64',
  F32 = 'F32',
  F64 = 'F64',
  Sensor = 'Sensor',
  Selection = 'Selection',
  Moment = 'Moment',
  Map = 'Map'
}

export interface ConfigTypeScalar {
  name: string
  widget: {
    kind: SensorWidgetKind
    data: never
  }
}

export interface ConfigTypeSensor {
  name: string
  widget: {
    kind: SensorWidgetKind.Sensor
    data: number
  }
}

export interface ConfigTypeSelection {
  name: string
  widget: {
    kind: SensorWidgetKind.Selection
    data: string[]
  }
}

export interface ConfigTypeMoment {
  name: string
  widget: {
    kind: SensorWidgetKind.Moment
    data: never
  }
}

export interface ConfigTypeMap {
  name: string
  widget: {
    kind: SensorWidgetKind.Map
    data: [ConfigType['widget'], ConfigType['widget']]
  }
}

export type ConfigType =
  | ConfigTypeSelection
  | ConfigTypeScalar
  | ConfigTypeMoment
  | ConfigTypeMap
  | ConfigTypeSensor

export interface ConfigRequest {
  id: number
  variableName: string
  name: string
  ty: ConfigType
}

export enum MeasurementKind {
  AirTemperature = 'AirTemperature',
  AirHumidity = 'AirHumidity',
  SoilTemperature = 'SoilTemperature',
  SoilMoisture = 'SoilMoisture'
}

export enum MeasurementType {
  Percentage = 'Percentage',
  FloatCelsius = 'FloatCelsius',
  RawAnalogRead = 'RawAnalogRead',
  Heap = 'Heap',
  Stack = 'Stack',
  Unknown = 'Unknown'
}

export interface Measurement {
  variableName: string
  name: string
  ty: MeasurementType
  kind: MeasurementKind
  color: string
}

export type Val =
  | string
  | number
  | { sensorId: number }
  | { hours: number; minutes: number; seconds: number }
  | { key: Val; value: Val }[]

export interface Config {
  request: ConfigRequest
  name: string
  typeName: string
  value: Val
}

export interface Sensor {
  id: number
  name: string
  index: number
  alias: string
  variableName: string
  color: string
  dependencies: string[]
  includes: string[]
  setups: string[]
  configurations: Config[]
  prototype: SensorPrototype
  measurements: Measurement[]
}

export interface SensorPrototype {
  id: number
  name: string
  dependencies: string[]
  includes: string[]
  setups: string[]
  configurationRequests: ConfigRequest[]
  variableName: string | null
}

export interface Event {
  measurements: Record<string, number>
  metadatas: Measurement[]
  stat: DeviceStat
  createdAt: string
}

export interface Device {
  id: number
  name: string
  description: string | null
  targetPrototype: TargetPrototype
  sensors: Sensor[]
  mac: string
  fileHash: string
  lastEvent: Event | null
  compiler: Compiler | null
  firmware: Firmware
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: number
  name: string
  description: string | null
  compiler: Compiler | null
  devices: Device[]
  targetPrototype: TargetPrototype
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: number
  name: string
  description: string | null
  collections: Array<Collection>
  members: Array<string> // username
  createdAt: string
  updatedAt: string
}

export interface DeviceLog {
  id: number
  log: string
  createdAt: string
}

export interface DevicePanic {
  id: number
  file: string
  line: number
  func: string
  msg: string
  createdAt: string
}

//export interface Dataset {
//  label: string;
//  yAxisID?: string;
//  backgroundColor: string;
//  data: number[];
//}

export interface Firmware {
  id: number
  hash: string
}

export interface DeviceStat {
  version: string
  timeRunning: number
  vcc: number
  freeDram: number
  freeIram: number | null
  freeStack: number
  biggestDramBlock: number
  biggestIramBlock: number | null
}

export interface User {
  id: number
  email: string
  username: string
  defaultOrganization: Organization
}

//export interface ChartOptions {
//  responsive: boolean;
//  maintainAspectRatio: boolean;
//  scales: {
//    yAxes: YAxes[];
//  };
//}
