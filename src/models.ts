export interface Organization {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  mac: string;
  file_hash: string;
  created_at: string;
  updated_at: string;
}

export interface LastUpdate {
  version: string;
  file_hash: string;
  created_at: string;
  updated_at: string;
}

export interface LastEvent {
  air_temperature_celsius: number;
  air_humidity_percentage: number;
  air_heat_index_celsius: number;
  soil_resistivity_raw: number;
  soil_temperature_celsius: number;
  created_at: string;
  updated_at: string;
}

export interface DeviceView {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  mac: string;
  file_hash: string;
  last_update?: LastUpdate;
  last_event?: LastEvent;
  created_at: string;
  updated_at: string;
}

export interface CollectionView {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  device: Array<Device>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationView {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  name: string;
  description?: string;
  collections: Array<Collection>;
  members: Array<string>; // username
  created_at: string;
  updated_at: string;
}

export interface DeviceLog {
  id: number; // TODO: this might break as i64 deserialization to number in js is tricky
  log: string;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  description?: string;
  owner_id: number;
  created_at: string;
}

export interface Event {
  id: number;
  air_temperature_celsius: number;
  air_humidity_percentage: number;
  soil_resistivity_raw: number;
  soil_temperature_celsius: number;
  plant_id: number;
  created_at: string;
}

export interface Status {
    plant: Plant;
    event?: Event;
    now: number;
}

export interface DevicePanic {
  id: number;
  plant_id: number;
  file: string;
  line: number;
  function: string;
  msg: string;
  created_at: string;
  updated_at: string;
}

export interface EventHistory {
    events: Event[];
    now: number;
}


export interface Dataset {
    label: string;
    yAxisID?: string;
    backgroundColor: string;
    data: number[];
  }
  
export interface Chart {
    labels: string[];
    datasets: Dataset[];
}

export interface YAxes {
    type: string;
    id: string;
    position?: string;
    ticks: {
        callback(value: number): string;
        min: number;
        max?: number;
    };
}

export interface ChartOptions {
    responsive: boolean;
    maintainAspectRatio: boolean;
    scales: {
        yAxes: YAxes[];
    };
}  
