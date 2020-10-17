<script lang="ts">
import { Line, mixins } from 'vue-chartjs-typescript';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Chart, ChartOptions } from '@/models';

const { reactiveProp } = mixins;

@Component({
  extends: Line,
  mixins: [reactiveProp],
})
export default class TimelineChart extends Vue {
  @Prop()
  chartData!: Chart;

  @Prop()
  chartOptions!: ChartOptions;

  public renderChart!: (chartData: Chart, options: ChartOptions) => void;

  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>
