<template>
  <v-app>
    <v-app-bar app color="secondary" flat>
      <img contain src="@/assets/logo.svg" height="50" width="50" />
      <v-select
        class="flex-grow-0"
        :items="$store.state.children"
        item-text="name"
        item-value="id"
        open-on-clear
        solo
        flat
        single-line
        hide-details
        background-color="transparent"
        :value="$store.state.activeChildId"
        @change="$store.dispatch('setActiveChildId', $event)"
      ></v-select>
      <v-spacer></v-spacer>
      <dialog-settings></dialog-settings>
      <template v-slot:extension>
        <v-tabs v-model="tab" fixed-tabs color="accent">
          <v-tabs-slider></v-tabs-slider>
          <v-tab to="/" exact>
            <v-icon>mdi-home</v-icon>
          </v-tab>

          <v-tab to="/stats">
            <v-icon>mdi-chart-timeline-variant</v-icon>
          </v-tab>

          <v-tab to="/calendar">
            <v-icon>mdi-calendar-today</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <dialog-type></dialog-type>
    <dialog-record></dialog-record>
    <dialog-alarm></dialog-alarm>
    <v-main v-if="$store.state.children.length === 0 && !$store.state.loaded">
      <v-progress-linear indeterminate></v-progress-linear>
    </v-main>
    <v-main v-if="$store.state.children.length === 0 && $store.state.loaded">
      <v-container> add Child or sync url </v-container>
    </v-main>
    <v-main v-if="$store.state.children.length > 0">
      <v-tabs-items
        v-model="tab"
        @change="updateRouter($event)"
        class="fill-height"
        touchless
      >
        <v-tab-item value="/">
          <v-divider></v-divider>
          <home v-if="tab === '/'"></home>
        </v-tab-item>
        <v-tab-item value="/stats">
          <v-divider></v-divider>
          <stats v-if="tab === '/stats'"></stats>
        </v-tab-item>
        <v-tab-item value="/calendar">
          <v-divider></v-divider>
          <calendar v-if="tab === '/calendar'"></calendar>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import Home from "@/views/Home";
import Stats from "@/views/Stats";
import Calendar from "@/views/Calendar";
import DialogSettings from "@/components/DialogSettings";
import DialogRecord from "@/components/DialogRecord";
import DialogType from "@/components/DialogType";
import DialogAlarm from "@/components/DialogAlarm";

export default {
  name: "App",
  components: {
    Home,
    Stats,
    Calendar,
    DialogSettings,
    DialogRecord,
    DialogType,
    DialogAlarm
  },
  data() {
    return {
      tab: null
    };
  },
  methods: {
    updateRouter(val) {
      this.$router.push(val);
    }
  }
};
</script>
<style>
.big-type {
  width: 56px !important;
  height: 56px !important;
  min-width: 56px !important;
  min-height: 56px !important;
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
.fill-width {
  width: 100%;
}

.btn-icon {
  justify-content: left;
  text-transform: none;
}
.btn-icon .v-icon {
  margin-left: -16px;
  border-radius: 50%;
  height: 36px;
  width: 36px;
  margin-right: 8px;
}

.type-icon {
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin: 0;
}

.type-icon.small {
  height: 24px;
  width: 24px;
}

.v-input__prepend-outer .type-icon {
  margin-top: -3px;
  margin-left: -6px;
}

.type-icon .v-icon__component {
  height: 20px;
  width: 20px;
}

.type-icon.small .v-icon__component {
  height: 16px;
  width: 16px;
}

.extra-dense .v-list-item {
  min-height: 30px;
  padding: 0;
}

.extra-dense .v-list-item .v-list-item__icon {
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 12px;
}

.extra-dense .v-list-item .v-list-item__action {
  margin-top: 3px;
  margin-bottom: 3px;
}

.extra-dense .v-list-item .v-list-item__action .v-btn {
  width: 24px;
  height: 24px;
}
.extra-dense .v-list-item .v-list-item__action .v-btn .v-icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
}

.extra-dense .v-list-item .v-list-item__content {
  padding-top: 8px;
  padding-bottom: 8px;
}

.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.v-application--is-ltr
  .v-input--reverse
  .v-input__slot
  .v-input--selection-controls__input {
  margin-right: 0;
  margin-left: 16px;
}
.v-timeline-item__dot {
  box-shadow: none;
}
</style>
