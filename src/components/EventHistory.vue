<template>
  <template v-if="props.history.length">
    <TimelineChart
      v-for="[chartData, chartOptions] in charts"
      :data="chartData"
      :options="chartOptions"
      class="w-full mt-5 px-40"
      :key="chartData"
    />

    <h3 v-if="unableToInferTypes && props.history.length">
      Warning: Unable to infer types, chart will be hard to read
    </h3>
    <h4 v-if="unableToInferTypes && props.history.length">
      Properly configure the device, adding a target and the appropriate sensors
      to view more detailed charts
    </h4>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TimelineChart from "@/components/TimelineChart.vue";
import { Event, MeasurementType, Device } from "@/models";
import { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  device: Device;
  history: Event[];
  showStale: boolean;
}>();

const unableToInferTypes = ref(
  props.history?.every((e) => e.metadatas.length === 0) ?? true
);

const color = (name: string): string | undefined => {
  return props.device.compiler?.sensors?.find((s) =>
    s.measurements.find((m) => m.name === name)
  )?.color;
};

const alias = (name: string): string | undefined => {
  return props.device.compiler?.sensors?.find((s) =>
    s.measurements.find((m) => m.name === name)
  )?.alias;
};

const metadatas = computed(() => {
  const obj = {};
  // This is horrible
  for (const event of props.history) {
    if (event.metadatas.length !== 0) {
      for (const metadata of event.metadatas) {
        if (obj[metadata.name]) continue;
        const sensorAlias = alias(metadata.name);

        if (!props.showStale && !sensorAlias) continue;

        const humanName = sensorAlias
          ? `${sensorAlias} - ${metadata.humanName}`
          : metadata.humanName;
        obj[metadata.name] = {
          ty: metadata.ty,
          humanName,
          color: color(metadata.name) ?? metadata.color,
        };
      }
    } else {
      if (!props.showStale) continue;

      for (const name of Object.keys(event.measurements)) {
        if (obj[name]) continue;
        obj[name] = {
          ty: MeasurementType.Unknown,
          humanName: name,
          color: null,
        };
      }
    }
  }
  return obj;
});

const chartOptions = (ty: MeasurementType): ChartOptions => {
  const scales = {
    x: {
      axis: "x",
      type: "linear",
      display: true,
      ticks: {
        callback: (value) => {
          return new Date(value).toLocaleString();
        },
      },
    },
  };

  for (const metadata of Object.values(metadatas.value)) {
    if (metadata.ty !== ty) continue;

    scales[metadata.ty] = {
      axis: "y",
      type: "linear",
      display: true,
      position: "left",
      ticks: {
        callback: (value) => {
          switch (metadata.ty) {
            case MeasurementType.Percentage:
              value = `${value}%`;
              break;
            case MeasurementType.RawAnalogRead:
              break;
            case MeasurementType.FloatCelsius:
              value = `${value}ºC`;
              break;
          }
          return value;
        },
      },
    };
  }
  let text = "Events";
  switch (ty) {
    case MeasurementType.Percentage:
      text = "Percentage";
      break;
    case MeasurementType.RawAnalogRead:
      text = "Analog Read (0-1024)";
      break;
    case MeasurementType.FloatCelsius:
      text = "Temperature";
      break;
  }
  return {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text,
      },
      tooltip: {
        callbacks: {
          title: (context) =>
            new Date(
              parseInt(context[0].label.replaceAll(".", ""))
            ).toLocaleString(),
          label: (context) => {
            let value = `${context.formattedValue}`;
            const field = context.dataset.label;
            const metadata = Object.values(metadatas.value).find(
              (m) => m.humanName === field
            );
            switch (metadata?.ty) {
              case MeasurementType.Percentage:
                value += "%";
                break;
              case MeasurementType.RawAnalogRead:
                break;
              case MeasurementType.FloatCelsius:
                value += "ºC";
                break;
            }
            return `${metadata?.humanName ?? field}: ${value}`;
          },
        },
      },
    },
    scales,
  };
};

const generateColor = () => {
  if (unableToInferTypes.value) {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  return "#666666";
};

const chartData = (ty: MeasurementType): ChartData => {
  const datasets = [];
  const data = props.history.map((e) => {
    e.createdAt = new Date(e.createdAt);
    return e;
  });
  for (const [field, metadata] of Object.entries(metadatas.value)) {
    if (metadata.ty !== ty) continue;

    datasets.push({
      label: metadata.humanName,
      yAxisID: metadata.ty,
      data,
      backgroundColor: metadata.color ? metadata.color : generateColor(),
      parsing: {
        xAxisKey: `createdAt`,
        yAxisKey: `measurements.${field}`,
      },
    });
  }

  return {
    datasets,
  };
};

const charts = computed((): ChartData[] => {
  const types: Set<MeasurementType> = new Set(
    props.history.flatMap((e) => Object.values(e.metadatas)).map((m) => m.ty)
  );

  const pair = [];
  for (const type of types) {
    const data = chartData(type);
    if (data.datasets.length === 0) continue;
    pair.push([data, chartOptions(type)]);
  }

  return pair;
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}
</style>
