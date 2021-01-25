<template>
  <v-container>
    // statitics for last 7, 14, 30 day or custom // avg subtype count per day
    // avg subtype duration per day
    <div style="width: 30%">
      <canvas ref="chart" width="400" height="400"></canvas>
      <v-btn @click="zoom({ x: 2, y: 95, stepSize: 0.1 })">0-2</v-btn>
      <v-btn @click="zoom({ x: 3, y: 120, stepSize: 0.25 })">0-4</v-btn>
      <v-btn @click="zoom({ x: 18, y: 190, stepSize: 1.0 })">0-18</v-btn>
      <v-btn @click="test()">testdarkmode</v-btn>
    </div>
    pattern by hours
    <schedule-chart></schedule-chart>
    duration by day bar chart<br />
    amount by day bar chart

    <br />
    special case growth
  </v-container>
</template>
<script>
import Chart from "chart.js";
import chartJsPluginZoom from "chartjs-plugin-zoom";
Chart.plugins.unregister(chartJsPluginZoom);
import ScheduleChart from "@/components/ScheduleChart";

export default {
  name: "Stats",
  data() {
    return {
      chart: null
    };
  },
  components: {
    ScheduleChart
  },
  methods: {
    test() {
      Chart.defaults.global.defaultFontColor = "white";
      Chart.defaults.global.defaultColor = "rgba(255, 255, 255, 0.2)";
      this.chart.options.scales.xAxes.forEach((a) => {
        a.gridLines.color = "rgba(255, 255, 255, 0.2)";
      });
      this.chart.options.scales.yAxes.forEach((a) => {
        a.gridLines.color = "rgba(255, 255, 255, 0.2)";
      });
      this.chart.update();
    },
    zoom(options) {
      this.chart.options.scales.xAxes[0].ticks.max = options.x;
      this.chart.options.scales.xAxes[0].ticks.stepSize = options.stepSize;
      this.chart.options.scales.yAxes[0].ticks.max = options.y;
      this.chart.options.scales.yAxes[1].ticks.max = options.y;
      this.chart.update();
    }
  },
  async mounted() {
    const data = await fetch("/growth_tables/girl_height.json").then((r) =>
      r.json()
    );
    // TODO limits different inn weight or height
    // TODO axis labels
    this.chart = new Chart(this.$refs.chart, {
      type: "scatter",
      data: {
        datasets: [
          {
            type: "line",
            label: "Kid",
            borderColor: "green",
            borderWidth: 2,
            fill: false,
            data: [
              {
                x: 0,
                y: 52
              },
              {
                x: 0.25,
                y: 55
              },
              {
                x: 0.5,
                y: 65
              }
            ]
          },
          {
            type: "line",
            label: "3rd",
            borderColor: "red",
            pointRadius: 0,
            pointHitRadius: 0,
            borderWidth: 1,
            fill: false,
            data: data.map((d) => {
              return {
                x: d.year,
                y: d["3rd"]
              };
            })
          },
          {
            type: "line",
            label: "50th",
            borderColor: "black",
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0,
            borderWidth: 1,
            data: data.map((d) => {
              return {
                x: d.year,
                y: d["50th"]
              };
            })
          },
          {
            yAxisID: "y-axis-2",
            label: "97th",
            type: "line",
            borderColor: "blue",
            fill: "-2",
            pointRadius: 0,
            pointHitRadius: 0,
            borderWidth: 1,
            data: data.map((d) => {
              return {
                x: d.year,
                y: d["97th"]
              };
            })
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {
                max: 2,
                min: 0,
                stepSize: 0.1
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                max: 95,
                min: 30
              }
            },
            {
              id: "y-axis-2",
              position: "right",
              ticks: {
                max: 95,
                min: 30
              }
            }
          ]
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
              rangeMin: {
                x: 0,
                y: 0
              },
              rangeMax: {
                x: 18,
                y: 190
              }
            },
            zoom: {
              enabled: true,
              mode: "xy",
              rangeMin: {
                x: 0,
                y: 0
              },
              rangeMax: {
                x: 18,
                y: 190
              }
            }
          }
        }
      },
      plugins: [chartJsPluginZoom]
    });
  }
};
</script>
