<template>
  <LineChart :chart-data="props.data" />
</template>

<script setup lang="ts">
//import { onMounted } from "vue";
import { LineChart } from 'vue-chart-3'
import type { ChartData } from 'chart.js'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  data: ChartData<'line'>
}>()
//onMounted(() => this.renderChart(this.data, this.options));
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: inherit !important;
  text-decoration: none;
}
</style>
