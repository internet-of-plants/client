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

<style scoped lang="scss"></style>
