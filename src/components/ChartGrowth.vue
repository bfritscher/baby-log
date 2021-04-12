<template>
  <v-card outlined class="fill-height">
    <v-card-title class="primary--text">
      {{ type[0].toUpperCase() }}{{ type.slice(1) }} Chart
      <v-spacer></v-spacer>
      <v-btn @click="explore()" text color="primary">{{
        chart && chart.options.plugins.zoom.zoom.enabled ? "reset" : "explore"
      }}</v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table
        height="500"
        fixed-header
        v-if="selectedZoomOption === zoomLevels[type].length - 1"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th>Date</th>
              <th class="text-right">{{ unit }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in childData" :key="d.src.fromDate">
              <td>{{ formatDate(d.src.fromDate) }}</td>
              <td class="text-right">{{ d.y }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <canvas
        ref="chart"
        width="400"
        height="400"
        v-show="selectedZoomOption !== zoomLevels[type].length - 1"
      ></canvas>
    </v-card-text>
    <v-card-actions>
      <v-btn-toggle
        dense
        class="justify-center flex-wrap fill-width"
        v-model="selectedZoomOption"
        mandatory
        color="primary"
      >
        <v-btn
          v-for="zoomOptions in zoomLevels[type]"
          :key="zoomOptions.label"
          >{{ zoomOptions.label }}</v-btn
        >
      </v-btn-toggle>
    </v-card-actions>
  </v-card>
</template>

<script>
import Chart from "chart.js";
import { MALE, FEMALE } from "@/schemas/child";
import chartJsPluginZoom from "chartjs-plugin-zoom";
Chart.plugins.unregister(chartJsPluginZoom);

const HEIGHT = "height";

export default {
  name: "ChartGrowth",
  props: {
    type: {
      default: HEIGHT
    }
  },
  data() {
    const zoomLevels = {
      height: [
        {
          label: "0-24 months",
          options: {
            x: 2,
            y: 95,
            stepSize: 1 / 12,
            xLabel: "months",
            stepSizeY: 5
          }
        },
        {
          label: "0-48 months",
          options: {
            x: 4,
            y: 120,
            stepSize: 1 / 6,
            xLabel: "months",
            stepSizeY: 5
          }
        },
        {
          label: "0-18 years",
          options: {
            x: 18,
            y: 190,
            stepSize: 1.0,
            xLabel: "years",
            stepSizeY: 10
          }
        },
        {
          label: "table",
          options: {}
        }
      ],
      weight: [
        {
          label: "0-90 days",
          options: {
            x: 0.25,
            y: 10,
            stepSize: 1 / 365,
            xLabel: "Days",
            stepSizeY: 0.05
          }
        },
        {
          label: "90-180 days",
          options: {
            xMin: 0.25,
            x: 0.5,
            y: 10,
            stepSize: 1 / 365,
            xLabel: "Days",
            stepSizeY: 0.05
          }
        },
        {
          label: "0-26 weeks",
          options: {
            x: 0.5,
            y: 10,
            stepSize: 1 / 52,
            xLabel: "weeks",
            stepSizeY: 0.5
          }
        },
        {
          label: "0-24 months",
          options: {
            x: 2,
            y: 18,
            stepSize: 1 / 12,
            xLabel: "months",
            stepSizeY: 1.0
          }
        },
        {
          label: "0-48 months",
          options: {
            x: 4,
            y: 25,
            stepSize: 1 / 6,
            xLabel: "months",
            stepSizeY: 1.0
          }
        },
        {
          label: "0-18 years",
          options: {
            x: 18,
            y: 90,
            stepSize: 1.0,
            xLabel: "years",
            stepSizeY: 5.0
          }
        },
        {
          label: "table",
          options: {}
        }
      ]
    };

    return {
      data: [],
      chart: undefined,
      childData: [],
      // TODO: #16 GrowthChart select default Zoom level based on age
      selectedZoomOption: 0,
      zoomLevels
    };
  },
  computed: {
    gender() {
      const genderMapping = {
        [MALE]: "boy",
        [FEMALE]: "girl"
      };
      return genderMapping[this.$store.getters.activeChild.gender];
    },
    watchData() {
      return [
        this.$store.getters.activeChild.gender,
        this.$store.state.records,
        this.$vuetify.theme.dark
      ];
    },
    chartOptions() {
      return this.zoomLevels[this.type][this.selectedZoomOption].options;
    },
    unit() {
      return this.type == HEIGHT ? "cm" : "kg";
    }
  },
  watch: {
    selectedZoomOption: {
      handler() {
        this.zoom(this.chartOptions);
      },
      immediate: false
    },
    watchData: {
      handler() {
        this.getData();
      },
      immediate: true
    }
  },
  methods: {
    async getData() {
      const birthdateTime = new Date(
        new Date(this.$store.getters.activeChild.birthdate)
          .toISOString()
          .substr(0, 10)
      ).getTime();
      this.data = await fetch(
        `./growth_tables/${this.gender}_${this.type}.json`
      ).then((r) => r.json());

      this.childData = this.$store.state.records
        .filter((r) => r.subtype === `GROWTH_${this.type.toUpperCase()}`)
        .map((r) => {
          return {
            x:
              (new Date(
                new Date(r.fromDate).toISOString().substr(0, 10)
              ).getTime() -
                birthdateTime) /
              (3600 * 24 * 365) /
              1000,
            y: r.amount,
            src: r
          };
        });
      this.draw();
    },
    formatDate(date) {
      const dateObj = new Date(date);

      return `${String(dateObj.getDate()).padStart(2, "0")}.${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}.${dateObj.getFullYear()}`;
    },
    zoom(options) {
      this.chart.options.scales.xAxes[0].ticks.max = options.x;
      this.chart.options.scales.xAxes[0].ticks.min = options.xMin || 0;
      this.chart.options.scales.xAxes[0].scaleLabel.labelString =
        options.xLabel;
      this.chart.options.scales.xAxes[0].ticks.stepSize = options.stepSize;
      this.chart.options.scales.yAxes[0].ticks.max = options.y;
      this.chart.options.scales.yAxes[0].ticks.stepSize = options.stepSizeY;
      this.chart.options.scales.yAxes[1].ticks.max = options.y;
      this.chart.options.scales.yAxes[1].ticks.stepSize = options.stepSizeY;

      this.chart.options.plugins.zoom.pan.rangeMax.x = options.x;
      this.chart.options.plugins.zoom.zoom.rangeMax.x = options.x;
      this.chart.options.plugins.zoom.pan.rangeMax.y = options.y;
      this.chart.options.plugins.zoom.zoom.rangeMax.y = options.y;

      this.chart.update();
    },
    explore() {
      if (this.chart.options.plugins.zoom.zoom.enabled) {
        this.chart.options.plugins.zoom.pan.enabled = false;
        this.chart.options.plugins.zoom.zoom.enabled = false;
        // redraw chart fully since resetZoom is bugged for label
        this.draw();
      } else {
        this.chart.options.plugins.zoom.pan.enabled = true;
        this.chart.options.plugins.zoom.zoom.enabled = true;
        this.chart.update();
      }
    },
    draw() {
      let gridLinesColor;
      if (this.$vuetify.theme.dark) {
        Chart.defaults.global.defaultFontColor = "white";
        Chart.defaults.global.defaultColor = "rgba(255, 255, 255, 0.2)";
        gridLinesColor = "rgba(255, 255, 255, 0.2)";
      } else {
        Chart.defaults.global.defaultFontColor = "#666";
        Chart.defaults.global.defaultColor = "rgba(0, 0, 0, 0.1)";
        gridLinesColor = "rgba(0, 0, 0, 0.1)";
      }

      const valueToLabel = (value) => {
        if (this.chartOptions.stepSize <= 1 / 365) {
          return Math.round(value * 365);
        }
        if (this.chartOptions.stepSize <= 1 / 52) {
          return Math.round(value * 52);
        }
        if (this.chartOptions.stepSize < 1) {
          return Math.round(value * 12);
        }
        return value;
      };

      this.chart = new Chart(this.$refs.chart, {
        type: "scatter",
        data: {
          datasets: [
            {
              type: "line",
              label: "Kid",
              borderColor: "#52c772",
              borderWidth: 2,
              fill: false,
              data: this.childData
            },
            {
              type: "line",
              label: "3rd",
              borderColor: "#48a0dc",
              pointRadius: 0,
              pointHitRadius: 0,
              borderWidth: 1,
              fill: false,
              data: this.data.map((d) => {
                return {
                  x: d.year,
                  y: d["3rd"]
                };
              })
            },
            {
              type: "line",
              label: "50th",
              borderColor: "#48a0dc",
              fill: false,
              pointRadius: 0,
              pointHitRadius: 0,
              borderWidth: 1,
              data: this.data.map((d) => {
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
              borderColor: "#48a0dc",
              backgroundColor: "rgba(72, 160, 220, 0.3)",
              fill: "-2",
              pointRadius: 0,
              pointHitRadius: 0,
              borderWidth: 1,
              data: this.data.map((d) => {
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
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label(tooltipItem) {
                return `${tooltipItem.value} ${this.unit} @ ${valueToLabel(
                  tooltipItem.label
                )}`;
              }
            }
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: this.chartOptions.xLabel
                },
                ticks: {
                  max: this.chartOptions.x,
                  min: 0,
                  stepSize: this.chartOptions.stepSize,
                  callback: valueToLabel
                },
                gridLines: {
                  color: gridLinesColor
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: this.unit
                },
                ticks: {
                  stepSize: this.chartOptions.stepSizeY,
                  max: this.chartOptions.y,
                  min: this.type == HEIGHT ? 30 : 0
                },
                gridLines: {
                  color: gridLinesColor
                }
              },
              {
                id: "y-axis-2",
                position: "right",
                ticks: {
                  stepSize: this.chartOptions.stepSizeY,
                  max: this.chartOptions.y,
                  min: this.type == HEIGHT ? 30 : 0
                },
                gridLines: {
                  color: gridLinesColor
                }
              }
            ]
          },
          plugins: {
            zoom: {
              pan: {
                enabled: false,
                mode: "xy",
                rangeMin: {
                  x: 0,
                  y: this.type == HEIGHT ? 30 : 0
                },
                rangeMax: {
                  x: this.chartOptions.x,
                  y: this.chartOptions.y
                }
              },
              zoom: {
                enabled: false,
                mode: "xy",
                rangeMin: {
                  x: 0,
                  y: this.type == HEIGHT ? 30 : 0
                },
                rangeMax: {
                  x: this.chartOptions.x,
                  y: this.chartOptions.y
                }
              }
            }
          }
        },
        plugins: [chartJsPluginZoom]
      });
    }
  }
};
</script>
