<template>
  <v-container>
    <v-date-picker
      first-day-of-week="1"
      full-width
      no-title
      :events="events"
      event-color="green lighten-1"
      v-model="day"
    ></v-date-picker>

    <v-card class="my-2 fill-height" outlined>
      <v-card-title class="text-subtitle-1 primary--text"
        >Daily summary</v-card-title
      >
      <v-card-text>
        <day-summary :day="day"></day-summary>
      </v-card-text>
    </v-card>

    <v-card class="my-2 fill-height" outlined>
      <v-card-title class="text-subtitle-1 primary--text"
        >Add record</v-card-title
      >
      <v-card-text>
        <v-btn
          outlined
          class="ma-2"
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
      </v-card-text>
    </v-card>
    <v-card class="my-2 fill-height" outlined>
      <v-card-title class="text-subtitle-1 primary--text">Records</v-card-title>
      <v-card-text> // TODO show records for a day </v-card-text>
    </v-card>
  </v-container>
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
