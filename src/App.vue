<template>
  <v-app>
    <v-app-bar app>
      <v-img contain src="@/assets/logo.svg" height="50" width="50"></v-img>
      <v-select
        :items="$store.state.children"
        item-text="name"
        item-value="id"
        open-on-clear
        solo
        flat
        single-line
        background-color="transparent"
        :value="$store.state.activeChildId"
        @change="$store.dispatch('setActiveChildId', $event)"
      ></v-select>
      <v-switch v-model="$vuetify.theme.dark" inset></v-switch>
      <v-spacer></v-spacer>
      <dialog-settings></dialog-settings>
    </v-app-bar>
    <dialog-type></dialog-type>
    <dialog-record></dialog-record>
    <dialog-alarm></dialog-alarm>
    <v-main v-if="$store.state.children.length > 0">
      <v-tabs v-model="tab" fixed-tabs>
        <v-tabs-slider></v-tabs-slider>
        <v-tab :to="{ name: 'Home' }" class="primary--text">
          <v-icon>mdi-home</v-icon>
        </v-tab>

        <v-tab :to="{ name: 'Stats' }" class="primary--text">
          <v-icon>mdi-chart-timeline-variant</v-icon>
        </v-tab>

        <v-tab :to="{ name: 'Calendar' }" class="primary--text">
          <v-icon>mdi-calendar-today</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" @change="updateRouter($event)">
        <v-tab-item value="/">
          <home></home>
        </v-tab-item>
        <v-tab-item value="/stats">
          <stats></stats>
        </v-tab-item>
        <v-tab-item value="/calendar">
          <calendar></calendar>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
    <v-main v-if="$store.state.children.length == 0 && $store.state.loaded">
      add Child or sync url
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
.btn-icon .v-icon {
  margin-left: -16px;
  border-radius: 50%;
  height: 36px;
  width: 36px;
  margin-right: 8px;
}
</style>
