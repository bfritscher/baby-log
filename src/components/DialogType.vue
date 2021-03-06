<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :max-width="$store.state.ui.dialogFullscreenMaxWidth"
    scrollable
    hide-overlay
    :value="type"
    transition="dialog-bottom-transition"
    @input="$event ? '' : close()"
  >
    <v-card v-if="type" tile>
      <v-card-title class="pa-0">
        <div class="flex">
          <v-toolbar :color="type.color" flat>
            <v-btn @click="close()" icon>
              <v-icon color="secondary">mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="secondary--text">{{
              type.name
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              v-if="currentSubtype"
              text
              @click="currentSubtype = undefined"
              >Cancel</v-btn
            >
            <v-btn
              v-if="!currentSubtype && !timer"
              icon
              @click.stop="
                $store.commit('updateUI', {
                  showRecordDialog: { type: type.id }
                })
              "
            >
              <v-icon color="secondary">mdi-plus</v-icon>
            </v-btn>
            <v-btn v-if="$vuetify.breakpoint.mdAndUp" @click="close()" icon>
              <v-icon color="secondary">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container fluid>
            <div v-if="type && !(subtype || timer)">
              <v-row>
                <v-col
                  cols="6"
                  md="4"
                  lg="3"
                  xl="2"
                  v-for="subtype in type.subtypes"
                  :key="subtype.id"
                >
                  <v-btn
                    block
                    class="btn-icon"
                    @click="selectSubtype(subtype)"
                    rounded
                    elevation="0"
                  >
                    <v-icon
                      color="secondary"
                      v-text="subtype.icon"
                      :style="{ 'background-color': type.color }"
                    ></v-icon>
                    {{ subtype.name }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-else>
              <v-row class="align-end mb-3">
                <v-col cols="5" md="4" lg="3" xl="2">
                  <v-btn
                    block
                    class="btn-icon"
                    rounded
                    elevation="0"
                    :color="type.colorLight"
                  >
                    <v-icon
                      color="secondary"
                      v-text="subtype.icon"
                      :style="{ 'background-color': type.color }"
                    ></v-icon>
                    {{ subtype.name }}
                  </v-btn>
                </v-col>
                <v-col class="text-h5 text-center">
                  <timer
                    v-if="timer"
                    :from-date="timer.fromDate"
                    :style="{ color: type.color }"
                  ></timer>
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-btn icon @click="showDetails = !showDetails"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="subtype.withAmount">
                <v-col cols="5" md="4">
                  <v-text-field
                    dense
                    single-line
                    filled
                    :prepend-icon="unitIcon"
                    :color="type.color"
                    type="number"
                    min="0"
                    placeholder="Amount"
                    v-model.number="amount"
                  ></v-text-field>
                </v-col>
                <v-col class="text-left" cols="4" md="2">
                  <v-btn
                    icon
                    @click="changeAmount(-1)"
                    :disabled="amount === 0"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn icon @click="changeAmount(1)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    dense
                    single-line
                    filled
                    :color="type.color"
                    type="text"
                    placeholder="Unit"
                    v-model="unit"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-text-field
              dense
              single-line
              filled
              :color="type.color"
              type="text"
              placeholder="Optional details"
              v-model="details"
              v-if="showDetails"
            ></v-text-field>
            <v-btn
              block
              depressed
              v-if="timer"
              @click="endTimer()"
              :color="type.color"
              class="secondary--text"
              >Finish</v-btn
            >

            <v-row
              v-if="
                !timer && subtype && (subtype.withAmount || subtype.askDetail)
              "
            >
              <v-col cols="12" md="6" offset-md="3">
                <v-btn
                  block
                  depressed
                  @click="createRecord()"
                  :color="type.color"
                  >Save</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </div>
      </v-card-title>
      <v-card-text class="min-height">
        <v-skeleton-loader
          v-if="isLoading || timelineRecordsPaged.length === 0"
          max-width="300"
          type="article@3"
        ></v-skeleton-loader>
        <div v-for="(day, i) in timelineRecordsPaged" :key="i">
          <p class="primary--text pt-3">{{ day.day }}</p>
          <v-timeline dense align-top class="pt-0 ml-n8">
            <template v-for="(record, i) in day.records">
              <v-timeline-item
                class="pb-1 ml-n10"
                hide-dot
                v-if="record.durationBetween"
                :key="`b-${i}`"
              >
                {{ record.durationBetween }}
              </v-timeline-item>
              <v-timeline-item
                class="pb-1"
                v-else
                :key="`dot-${i}`"
                fill-dot
                small
                :color="typeLookup[record.type].color"
                v-ripple
                @click.native.stop="
                  $store.commit('updateUI', { showRecordDialog: record })
                "
              >
                <template v-slot:icon>
                  <v-icon
                    class="type-icon small"
                    color="secondary"
                    v-text="
                      subtypeLookup[
                        record.subtype === 'NONE' ? record.type : record.subtype
                      ].icon
                    "
                  >
                  </v-icon>
                </template>
                <v-row class="pt-1 ml-n6">
                  <v-col class="pa-2">
                    <strong>{{ time(record) }}</strong>
                    {{ subtypeLookup[record.subtype].name
                    }}<span v-if="record.toDate"
                      >, {{ duration(record) }}
                    </span>
                    <span
                      v-if="
                        subtypeLookup[record.subtype].withAmount &&
                        record.amount
                      "
                    >
                      {{ record.amount }}{{ record.unit }}
                    </span>
                    <span v-if="record.details">, {{ record.details }} </span>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </template>
          </v-timeline>
        </div>
        <v-btn
          block
          text
          color="primary"
          v-if="!isLoading && timelineRecordsPaged.length > 0"
          @click="loadMore()"
          >Load More</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import Timer from "@/components/Timer";
import { setThemeColor } from "@/services/utils";
import { time, duration } from "@/filters/recordFilters";
import createTimline from "@/services/timeline";
// import { getFromApiServer } from "@/services/liteModeApi";

export default {
  name: "DialogType",
  components: {
    Timer
  },
  data() {
    const defaultNbDaysHistory = 3;
    return {
      showDetails: false,
      details: "",
      amount: undefined,
      unit: undefined,
      currentSubtype: undefined,
      nbDaysHistory: defaultNbDaysHistory,
      defaultNbDaysHistory,
      timer: undefined,
      isLoading: true,
      timelineRecordsPaged: []
    };
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    type() {
      return this.typeLookup[this.$store.state.ui.showTypeDialog];
    },
    subtype() {
      return (
        this.currentSubtype ||
        (this.timer && this.subtypeLookup[this.timer.subtype])
      );
    },
    unitIcon() {
      if (this.subtype && this.subtype.withAmount) {
        return this.$store.state.ui.unitsIcon[this.subtype.unit];
      }
      return "";
    }
  },
  watch: {
    type: {
      handler(newVal, oldVal) {
        if (newVal === oldVal) return;
        console.log("watchType");
        let path = "/";
        if (!this.type) {
          this.showDetails = false;
          this.currentSubtype = undefined;
          this.nbDaysHistory = this.defaultNbDaysHistory;
          this.timelineRecordsPaged = [];
          this.isLoading = true;
          this.timer = undefined;
          setThemeColor("#333333");
          if (this.$route.name === "Type") {
            this.$router.back();
          }
        } else {
          if (this.$store.state.ui.liteMode) {
            const cache = localStorage.getItem(
              `BABY_TRACKER_${this.$store.state.activeChildId}_${this.type?.id}`
            );
            if (cache) {
              this.timelineRecordsPaged = JSON.parse(cache);
              this.isLoading = false;
            }
            setTimeout(() => {
              this.loadTimeline().then(() => {
                this.isLoading = false;
              }, 300);
            });
          } else {
            this.loadTimeline().then(() => {
              this.isLoading = false;
            });
          }

          this.timer = this.$store.state.timers.find((record) => {
            return record.type === this.type.id;
          });
          setThemeColor(this.type.colorDark);
          path += this.type.id;
          if (this.$route.path !== path) {
            this.$router.push(path);
          }
        }
      },
      immediate: true
    },
    $route() {
      if (this.$route.name === "Type") {
        if (
          this.$route.params.typeId &&
          this.$route.params.typeId !== this.$store.state.ui.showTypeDialog
        ) {
          this.$store.commit("updateUI", {
            showTypeDialog: this.$route.params.typeId
          });
        }
      }
      if (this.$route.path === "/" && this.$store.state.ui.showTypeDialog) {
        this.$store.commit("updateUI", {
          showTypeDialog: false
        });
      }
    },
    "$store.state.timers"() {
      if (this.type) {
        this.timer = this.$store.state.timers.find((record) => {
          return record.type === this.type.id;
        });
      }
    },
    subtype: {
      handler() {
        if (!this.subtype) {
          this.showDetails = false;
          this.details = "";
        } else {
          this.amount = undefined;
          this.unit = this.subtype
            ? this.$store.state.config.units[this.subtype.unit]
            : undefined;
        }
      },
      immediate: true
    }
  },
  methods: {
    time,
    duration,
    changeAmount(direction) {
      if (!this.amount) {
        this.amount = 0;
      }
      this.amount +=
        direction * this.$store.state.config.unitsIncrements[this.subtype.unit];
      if (this.amount < 0) {
        this.amount = 0;
      }
    },
    async selectSubtype(subtype) {
      this.currentSubtype = subtype;
      if (!subtype.withTimer && (subtype.withAmount || subtype.askDetail)) {
        if (subtype.askDetail) {
          this.showDetails = true;
        }
        // manually add the record with save button
        return;
      }
      // auto create for timer or auto add
      this.createRecord();
    },
    async createRecord() {
      const record = {
        type: this.type.id,
        subtype: this.subtype.id
      };
      if (this.details) {
        record.details = this.details;
      }
      if (this.subtype.withAmount) {
        record.unit = this.unit;
        record.amount = this.amount;
      }
      const rxDocument = await this.$store.dispatch("createRecord", record);
      if (rxDocument.timer) {
        this.timer = rxDocument;
        this.$store.commit(
          "setTimers",
          this.$store.state.timers.concat([this.timer])
        );
      }
      this.currentSubtype = null;
      rxDocument.save().then(() => {
        if (this.$store.state.ui.liteMode) {
          setTimeout(() => {
            this.loadTimeline().then(() => {
              this.isLoading = false;
            }, 300);
          });
        }
      });
    },
    endTimer() {
      const updates = {
        toDate: new Date().toISOString(),
        details: this.details,
        timer: undefined
      };
      if (this.subtype.withAmount) {
        updates.unit = this.unit || "";
        updates.amount = this.amount || 0;
      }
      const timer = this.timer;
      this.timer = undefined;
      const timerIds = this.$store.state.timers.map((t) =>
        t.id ? t.id : t._id
      );
      const index = timerIds.indexOf(timer.id ? timer.id : timer._id);
      if (index > -1) {
        const timers = this.$store.state.timers.slice();
        timers.splice(index, 1);
        this.$store.commit("setTimers", timers);
      }
      timer.atomicPatch(updates).then(() => {
        if (this.$store.state.ui.liteMode) {
          setTimeout(() => {
            this.loadTimeline().then(() => {
              this.isLoading = false;
            }, 300);
          });
        }
      });
    },
    close() {
      this.$store.commit("updateUI", { showTypeDialog: false });
    },
    loadMore() {
      this.nbDaysHistory += this.defaultNbDaysHistory;
      this.loadTimeline();
    },
    async loadTimeline() {
      console.log("loadTimeline");
      /*
      if (this.$store.state.ui.liteMode) {
        getFromApiServer(
          this.$store.state.remoteURL,
          // TODO: make param
          `https://baby-log-api.bf0.ch/timeline/${this.$store.state.activeChildId}/${this.type?.id}/${this.nbDaysHistory}`
        ).then((data) => {
          this.timelineRecordsPaged = data;
          localStorage.setItem(
            `BABY_TRACKER_${this.$store.state.activeChildId}_${this.type?.id}`,
            JSON.stringify(this.timelineRecordsPaged)
          );
        });
      } else {
        */
      this.timelineRecordsPaged = createTimline(
        this.$store.state.records,
        this.type?.id,
        this.nbDaysHistory
      );
      if (this.timelineRecordsPaged.length > 0) {
        localStorage.setItem(
          `BABY_TRACKER_${this.$store.state.activeChildId}_${this.type?.id}`,
          JSON.stringify(this.timelineRecordsPaged)
        );
      }
      /*
      }
      */
    }
  }
};
</script>
<style scoped>
.min-height {
  min-height: 50vh;
}
</style>
