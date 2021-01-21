<template>
  <div>
    <h1>Calendar</h1>
    <v-date-picker
      first-day-of-week="1"
      full-width
      no-title
      :events="['2021-01-08']"
      event-color="green lighten-1"
      v-model="day"
    ></v-date-picker>
    <day-summary :day="day"></day-summary>
    // TODO show records for a day
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
  }
};
</script>
