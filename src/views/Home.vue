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
      <h2>Latest activity</h2>
      <record
        v-for="(record, i) in $store.getters.latestActivity"
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

<style>
.none {
  color: #ec9d24;
  color: #ffe0b2;
  color: #fdb74d;

  color: #2789cf;
  color: #9dcff2;
  color: #48a0dc;

  color: #5d43b2;
  color: #c3b9e4;
  color: #7a62c9;

  color: #129ea3;
  color: #c1f3f5;
  color: #17c6cc;

  color: #42a15c;
  color: #b2edc2;
  color: #52c772;

  color: #db7e4d;
  color: #ffceb5;
  color: #ff9259;

  color: #f15540;
  color: #fdd4cd;
  color: #fd7059;
}
</style>

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
  methods: {
    dialogType(type) {
      this.currentType = type;
      this.showTypeDialog = true;
    }
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    timers() {
      return this.$store.state.timers;
    },
    config() {
      return this.$store.state.config;
    }
  }
};

// all logs group by day
// loading more? / limit loading: on all logs
// calendar logs
// Layouts
// about with license of images
// test offline mode

// basic stats graphs
// schedule graph icons for events without duration?
// legends

// [future maybe]
// daily reminder vitamin D
// alarms
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
