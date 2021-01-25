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
          <v-tab :to="{ name: 'Home' }" exact>
            <v-icon>mdi-home</v-icon>
          </v-tab>

          <v-tab :to="{ name: 'Stats' }">
            <v-icon>mdi-chart-timeline-variant</v-icon>
          </v-tab>

          <v-tab :to="{ name: 'Calendar' }">
            <v-icon>mdi-calendar-today</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <dialog-type></dialog-type>
    <dialog-record></dialog-record>
    <dialog-alarm></dialog-alarm>
    <v-main v-if="$store.state.children.length > 0">
      <v-tabs-items
        v-model="tab"
        @change="updateRouter($event)"
        class="fill-height"
      >
        <v-tab-item value="/">
          <v-divider></v-divider>
          <home></home>
        </v-tab-item>
        <v-tab-item value="/stats">
          <v-divider></v-divider>
          <stats></stats>
        </v-tab-item>
        <v-tab-item value="/calendar">
          <v-divider></v-divider>
          <calendar></calendar>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
    <v-main v-if="$store.state.children.length == 0 && $store.state.loaded">
      <v-container> add Child or sync url </v-container>
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
  data() {
    return {
      tab: null
    };
  },
  methods: {
    updateRouter(val) {
      this.$router.push(val);
    }
  },
  components: {
    Home,
    Stats,
    Calendar,
    DialogSettings,
    DialogRecord,
    DialogType,
    DialogAlarm
  }
};
</script>
<style>
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

.v-input__prepend-outer .type-icon {
  margin-top: -3px;
  margin-left: -6px;
}

.type-icon .v-icon__component {
  height: 20px;
  width: 20px;
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
