<template>
  <div class="plant-history">
    <!-- <h1>Value Making Per Hour</h1> -->
    <!-- <TimelineChart -->
    <!--   v-bind:chartData="valuePerHourTimelineData()" -->
    <!--   v-bind:chartOptions="chartOptions(false)" /> -->

    <!-- <h1>Plant Value History</h1> -->
    <!-- <TimelineChart -->
    <!--   v-bind:chartData="totalValueTimelineData()" -->
    <!--   v-bind:chartOptions="chartOptions(true)" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import { Chart, ChartOptions } from '@/models';
import { Line, mixins } from 'vue-chartjs-typescript';

const { reactiveProp } = mixins;

export default defineComponent({
  name: 'TimelineChart',
  extends: Line,
  mixins: [reactiveProp],
  prop() {
    return {
      data: {
        type: Object as PropType<Chart>,
        required: true,
      },
      options: {
        type: Object as PropType<ChartOptions>,
        required: true,
      },
    };
  },
  setup() {
    onMounted(() => this.renderChart(this.data, this.options));
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}

.plant-card { width: 19%; margin: 0; padding: 0; display: inline-block; word-wrap: anywhere;}
.plant-card p { margin: 0; }
</style>
