<template>
  <TimelineChart v-if="chartData" :data="chartData" :options="chartOptions" />
  <!--:options="chartOptions(false, props.history[0], field)"-->
</template>

<script setup lang="ts">
import { computed } from "vue";
import TimelineChart from "@/components/TimelineChart.vue";
import { Event, MeasurementType } from "@/models";
import { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  history: Event[];
}>();

const metadatas = computed(() => {
  const obj = {};
  // This is horrible
  for (const event of props.history) {
    for (const measurement of event.metadatas) {
      if (obj[measurement.name]) continue;
      obj[measurement.name] = measurement.ty;
    }
  }
  return obj;
});

const chartOptions = computed((): ChartOptions => {
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

  for (const ty of Object.values(metadatas.value)) {
    let position = "left";
    switch (ty) {
      case MeasurementType.RawAnalogRead:
        position = "right";
    }
    scales[ty] = {
      axis: "y",
      type: "linear",
      display: true,
      position,
      ticks: {
        callback: (value) => {
          switch (ty) {
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
        text: "Events",
      },
      tooltip: {
        callbacks: {
          title: (context) => 
            new Date(parseInt(context[0].label.replaceAll(".", ""))).toLocaleString()
          ,
          label: (context) => {
            let value = `${context.formattedValue}`;
            const field = context.dataset.label;
            const ty = metadatas.value[field];
            switch (ty) {
              case MeasurementType.Percentage:
                value += "%";
                break;
              case MeasurementType.RawAnalogRead:
                break;
              case MeasurementType.FloatCelsius:
                value += "ºC";
                break;
            }
            return `${field}: ${value}`;
          },
        },
      },
    },
    scales,
  };
});

const chartData = computed((): ChartData => {
  const datasets = [];
  const data = props.history.map((e) => {
    e.createdAt = new Date(e.createdAt);
    return e;
  });
  for (const [field, ty] of Object.entries(metadatas.value)) {
    datasets.push({
      label: field,
      yAxisID: ty,
      data,
      backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      parsing: {
        xAxisKey: `createdAt`,
        yAxisKey: `measurements.${field}`,
      },
    });
  }
  return {
    datasets,
  };
});

//const chartOptions = (
//  multiAxis: boolean,
//  event: Event,
//  field: string
//): ChartOptions => {
//  const yAxes: YAxes[] = [
//    {
//      type: "linear",
//      id: field,
//      position: "left",
//      //ticks: {
//      // callback: (value: number): string => formatUnit(),
//      // min: -100 // depends on the unit
//      //}
//    },
//  ];
//
//  //if (multiAxis) {
//  //  yAxes.push({
//  //    yAxes.push({
//  //      type: 'linear',
//  //      id: 'what?'
//  //      positions: 'right',
//  //ticks: {
//  // callback: (value: number): string => formatUnit(),
//  // min: -100 // depends on the unit
//  // max: 100
//  //}
//  //    });
//  //  });
//  //}
//  return {
//    responsive: true,
//    maintainAspectRatio: false,
//    scales: { yAxes },
//  };
//};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}
</style>
