<template>
  <div>
    <h1>Calendar</h1>
    <v-date-picker
      first-day-of-week="1"
      full-width
      no-title
      :events="events"
      event-color="green lighten-1"
      v-model="day"
    ></v-date-picker>
    <day-summary :day="day"></day-summary>
    // TODO show records for a day
    <v-btn
      v-for="type in $store.state.config.types"
      :key="type.id"
      :color="type.color"
      @click.stop="
        $store.commit('updateUI', {
          showRecordDialog: {
            type: type.id,
            fromDate: `${day}T12:00:00`,
            toDate: `${day}T12:00:00`
          }
        })
      "
    >
      <v-icon v-text="type.icon"></v-icon>
    </v-btn>
  </div>
</template>

<script>
import DaySummary from "@/components/DaySummary";

export default {
  name: "Calendar",
  components: {
    DaySummary
  },
  data() {
    return {
      day: new Date().toISOString()
    };
  },
  computed: {
    events() {
      const events = [];
      const child = this.$store.getters.activeChild;
      if (child && child.birthdate) {
        events.push(child.birthdate);
      }
      return events;
    }
  }
};
</script>
