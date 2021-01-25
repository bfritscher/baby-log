<template>
  <div class="home">
    <v-card tile>
      <v-container>
        <v-slide-group>
          <v-slide-item v-for="type in config.types" :key="type.id">
            <v-btn
              :color="type.color"
              depressed
              class="ma-1 px-md-12 px-lg-16 big-type"
              @click.stop="$store.commit('updateUI', { showTypeDialog: type })"
            >
              <v-icon v-text="type.icon"></v-icon>
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </v-container>
    </v-card>

    <v-container class="grey lighten-3">
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card class="my-2">
            <v-list dense>
              <div v-for="(timer, index) in timers" :key="timer.id">
                <v-list-item
                  @click.stop="
                    $store.commit('updateUI', {
                      showTypeDialog: typeLookup[timer.type]
                    })
                  "
                >
                  <v-list-item-icon>
                    <v-icon
                      class="pulse type-icon"
                      v-text="subtypeLookup[timer.subtype].icon"
                      :style="{
                        'background-color': typeLookup[timer.type].color
                      }"
                    ></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-row>
                      <v-col>
                        <v-list-item-title class="font-weight-medium">{{
                          subtypeLookup[timer.subtype].name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>in progress</v-list-item-subtitle>
                      </v-col>
                      <v-col class="text-h5 text-right">
                        <timer
                          :style="{ color: typeLookup[timer.type].color }"
                          :fromDate="timer.fromDate"
                        ></timer>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  v-if="index < timers.length - 1"
                  :key="index"
                ></v-divider>
              </div>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card class="my-2 fill-height">
            <v-card-title class="text-subtitle-1 primary--text pb-0">
              Next Activities
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click.stop="
                  $store.commit('updateUI', {
                    showAlarmDialog: { type: 'FEEDING', enabled: true }
                  })
                "
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-list dense>
              <v-list-item
                v-for="(alarm, i) in activeAlarms"
                :key="i"
                @click.stop="handleAlarmClick(alarm)"
              >
                <v-list-item-icon class="my-1 mr-3">
                  <v-icon
                    class="type-icon"
                    v-text="
                      alarm.subtype
                        ? subtypeLookup[alarm.subtype].icon
                        : typeLookup[alarm.type].icon
                    "
                    :style="{
                      'background-color': typeLookup[alarm.type].color
                    }"
                  ></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ typeLookup[alarm.type].name }}
                    <span v-if="alarm.subtype">{{
                      subtypeLookup[alarm.subtype].name
                    }}</span>
                    {{ alarm.details }} <b>{{ alarm.durationToNextText }}</b>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="ma-0">
                  <v-tooltip bottom open-delay="600">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        @click.stop="
                          $store.commit('updateUI', {
                            showAlarmDialog: alarm
                          })
                        "
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit Alarm</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card class="my-2 fill-height">
            <v-card-title class="text-subtitle-1 primary--text pb-0"
              >Latest activities</v-card-title
            >
            <v-list dense>
              <record
                v-for="(record, i) in $store.getters.latestActivityByType"
                :key="i"
                :record="record"
              ></record>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card class="my-2 fill-height">
            <v-card-title class="text-subtitle-1 primary--text pb-0"
              >Summary for today</v-card-title
            >
            <v-list dense class=" pb-0">
              <v-list-item>
                <v-list-item-icon class="my-1 mr-3">
                  <v-icon class="type-icon primary"
                    >mdi-calendar-month</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                  <child-age
                    v-if="
                      $store.getters.activeChild &&
                      $store.getters.activeChild.birthdate
                    "
                    :birthdate="$store.getters.activeChild.birthdate"
                  ></child-age>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <day-summary :day="today" class="pt-0"></day-summary>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4" offset-lg="4">
          <dialog-all-logs></dialog-all-logs>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import DialogAllLogs from "@/components/DialogAllLogs";
import Record from "@/components/Record";
import ChildAge from "@/components/ChildAge.vue";
import Timer from "@/components/Timer";
import DaySummary from "@/components/DaySummary";

export default {
  name: "Home",
  data() {
    return {
      today: new Date().toISOString()
    };
  },
  components: {
    DialogAllLogs,
    Record,
    ChildAge,
    Timer,
    DaySummary
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup", "activeAlarms"]),
    timers() {
      return this.$store.state.timers;
    },
    config() {
      return this.$store.state.config;
    }
  },
  methods: {
    async handleAlarmClick(alarm) {
      if (alarm.subtype) {
        const record = {
          type: alarm.type,
          subtype: alarm.subtype
        };
        if (alarm.details) {
          record.details = alarm.details;
        }
        const rxDocument = await this.$store.dispatch("createRecord", record);
        rxDocument.save();
      } else {
        this.$store.commit("updateUI", {
          showTypeDialog: this.typeLookup[alarm.type]
        });
      }
    }
  }
};

// Layouts
// all logs group by day refactor with timline and calendar
// test offline mode

// basic stats graphs
// schedule graph icons for events without duration?
// legends

// [future maybe]
// readme captures
// support category? other name? subsubtype?

// notifications
// https://developers.google.com/web/fundamentals/push-notifications/display-a-notification
// server events /hooks
// detect darkmode
// notifications push?
// poo colors?
// custom initial values for amount
// add src field to record? (import, username, other)
// edit/order/hide types/subtypes
// virtual list for better performance

// more types/subtypes:
// Toothbrushing
// Doctor visit
// Other?
// list milestones based on age?
// https://www.thebump.com/a/baby-milestone-chart
</script>
<style>
.big-type {
  width: 60px !important;
  height: 60px !important;
  min-width: 60px !important;
  min-height: 60px !important;
}
.big-type .v-icon__component {
  width: 30px;
  height: 30px;
}

.pulse {
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  transform-origin: 50% 50%;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
