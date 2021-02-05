export interface Plant {
    id: string;
    name: string;
    description?: string;
    owner_id: number;
    created_at: number;
}

export interface Event {
    id: number;
    air_temperature_celsius: number;
    air_humidity_percentage: number;
    soil_resistivity_raw: number;
    soil_temperature_celsius: number;
    plant_id: number;
    created_at: number;
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
    created_at: number;
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