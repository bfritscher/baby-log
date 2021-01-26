<template>
  <v-container>
    <v-slide-group v-model="activeTypeIndex" center-active>
      <v-slide-item
        v-for="type in $store.state.config.types"
        :key="type.id"
        v-slot="{ active, toggle }"
      >
        <v-btn
          :color="type.color"
          :depressed="active"
          :outlined="!active"
          class="ma-1 px-md-12 px-lg-16 big-type"
          @click="toggle"
        >
          <v-icon
            v-text="type.icon"
            :color="active ? 'secondary' : null"
          ></v-icon>
        </v-btn>
      </v-slide-item>
    </v-slide-group>
    <h2 class="subtitle-1 primary--text">{{ activeType.name }}</h2>
    // statitics for last 7, 14, 30 day or custom // avg subtype count per day
    // avg subtype duration per day
    <div v-if="activeType.id === 'GROWTH'">
      // TODO move/refactor test chart
      <canvas ref="chart" width="400" height="400"></canvas>
      <v-btn @click="zoom({ x: 2, y: 95, stepSize: 0.1 })">0-2</v-btn>
      <v-btn @click="zoom({ x: 3, y: 120, stepSize: 0.25 })">0-4</v-btn>
      <v-btn @click="zoom({ x: 18, y: 190, stepSize: 1.0 })">0-18</v-btn>
      <v-btn @click="test()">testdarkmode</v-btn>
    </div>
    pattern by hours
    <schedule-chart :type="activeType"></schedule-chart>
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
      activeTypeIndex: undefined,
      chart: null
    };
  },
  components: {
    ScheduleChart
  },
  computed: {
    activeType() {
      if (this.activeTypeIndex === undefined) {
        return {
          id: "ALL",
          name: "All in One"
        };
      }
      return this.$store.state.config.types[this.activeTypeIndex];
    }
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
    /*
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
    */
  }
};
</script>
