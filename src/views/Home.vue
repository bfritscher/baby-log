<template>
  <div class="home">
    <div>
      // TODO: scroll on mobile?
      <v-btn
        v-for="type in config.types"
        :key="type.id"
        :color="type.color"
        @click.stop="$store.commit('updateUI', { showTypeDialog: type })"
      >
        <v-icon v-text="type.icon"></v-icon>
      </v-btn>
    </div>
    <div>
      <div
        v-for="timer in timers"
        :key="timer.id"
        @click.stop="
          $store.commit('updateUI', { showTypeDialog: typeLookup[timer.type] })
        "
      >
        <v-icon
          class="pulse"
          v-text="subtypeLookup[timer.subtype].icon"
          :style="{ 'background-color': typeLookup[timer.type].color }"
        ></v-icon>
        {{ subtypeLookup[timer.subtype].name }}
        in progress
        <timer :fromDate="timer.fromDate"></timer>
      </div>
    </div>
    <v-card>
      <h2>
        Next Activities
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
      </h2>
      <div
        v-for="(alarm, i) in activeAlarms"
        :key="i"
        @click.stop="handleAlarmClick(alarm)"
      >
        <v-icon
          v-text="
            alarm.subtype
              ? subtypeLookup[alarm.subtype].icon
              : typeLookup[alarm.type].icon
          "
          :style="{ 'background-color': typeLookup[alarm.type].color }"
        ></v-icon>
        {{ typeLookup[alarm.type].name }}
        <span v-if="alarm.subtype">{{
          subtypeLookup[alarm.subtype].name
        }}</span>
        {{ alarm.details }} <b>{{ alarm.durationToNextText }}</b>
        <v-btn
          icon
          @click.stop="
            $store.commit('updateUI', {
              showAlarmDialog: alarm
            })
          "
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
    </v-card>
    <v-card>
      <h2>Latest activities</h2>
      <record
        v-for="(record, i) in $store.getters.latestActivityByType"
        :key="i"
        :record="record"
      ></record>
    </v-card>
    <v-card>
      <h2>Summary for today</h2>
      <child-age
        v-if="
          $store.getters.activeChild && $store.getters.activeChild.birthdate
        "
        :birthdate="$store.getters.activeChild.birthdate"
      ></child-age>
      <day-summary :day="today"></day-summary>
    </v-card>
    <dialog-all-logs></dialog-all-logs>
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
