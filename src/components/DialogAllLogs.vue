<template>
  <v-dialog fullscreen hide-overlay v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" block>All Logs</v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary">
        <v-btn @click="dialog = false" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>All Logs</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div v-for="(group, i) in groupedRecordsPaged" :key="i">
        <h2>{{ group.day }}</h2>
        <div
          v-for="(record, i) in group.records"
          :key="i"
          @click.stop="$store.commit('updateUI', { showRecordDialog: record })"
        >
          <v-icon
            v-text="subtypeLookup[record.subtype].icon"
            :style="{ 'background-color': typeLookup[record.type].color }"
          ></v-icon>
          <strong>{{ record.time() }}</strong>
          <strong>{{ subtypeLookup[record.subtype].name }}</strong>
          {{ record.duration() }}
          <span
            v-if="subtypeLookup[record.subtype].withAmount && record.amount"
          >
            {{ record.amount }}{{ record.unit }}
          </span>
          {{ record.details }}
        </div>
      </div>
      <v-btn
        v-if="nbDaysHistory < groupedRecords.length"
        @click="nbDaysHistory += defaultNbDaysHistory"
        >Load More</v-btn
      >
    </v-card>
  </v-dialog>
</template>
<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "DialogAllLogs",
  data() {
    const defaultNbDaysHistory = 2;
    return {
      dialog: false,
      nbDaysHistory: defaultNbDaysHistory,
      defaultNbDaysHistory
    };
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    groupedRecordsPaged() {
      return this.groupedRecords.slice(0, this.nbDaysHistory);
    },
    groupedRecords() {
      let lastDateTime = new Date();
      const today = new Date(new Date().toDateString());
      let dayRecords = [];
      const days = [
        {
          day: "Today",
          records: dayRecords
        }
      ];
      for (let record of this.$store.state.records) {
        const currentDateTime = new Date(record.fromDate);
        if (
          currentDateTime.getFullYear() !== lastDateTime.getFullYear() ||
          currentDateTime.getMonth() !== lastDateTime.getMonth() ||
          currentDateTime.getDay() !== lastDateTime.getDay()
        ) {
          const dateDiff = today - new Date(currentDateTime.toDateString());
          let dateFormat = "Do MMMM, dddd";
          if (today.getFullYear() !== currentDateTime.getFullYear()) {
            dateFormat += " YYYY";
          }
          let day = moment(currentDateTime).format(dateFormat);
          if (dateDiff === 24 * 3600 * 1000) {
            day = "Yesterday";
          }
          dayRecords = [];
          days.push({
            day,
            records: dayRecords
          });
        }
        dayRecords.push(record);
        lastDateTime = currentDateTime;
      }
      return days;
    }
  }
};
</script>
