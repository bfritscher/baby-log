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
          class="big-type ma-2"
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
      <v-card-text>
        <v-list dense class="extra-dense mb-2">
          <v-list-item
            v-for="(record, i) in dayRecords"
            :key="i"
            @click.stop="
              $store.commit('updateUI', { showRecordDialog: record })
            "
          >
            <v-list-item-icon>
              <v-icon
                color="secondary"
                class="type-icon small"
                v-text="subtypeLookup[record.subtype].icon"
                :style="{ 'background-color': typeLookup[record.type].color }"
              ></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <div>
                <strong>{{ time(record) }}</strong>
                {{ subtypeLookup[record.subtype].name }}
                <span v-if="record.toDate">, {{ duration(record) }}</span>
                <span
                  v-if="
                    subtypeLookup[record.subtype].withAmount && record.amount
                  "
                  >, {{ record.amount }}{{ record.unit }}
                </span>
                <span v-if="record.details"> , {{ record.details }} </span>
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DaySummary from "@/components/DaySummary";
import { time, duration } from "@/filters/recordFilters";

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
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    events() {
      const events = [];
      const child = this.$store.getters.activeChild;
      if (child && child.birthdate) {
        events.push(child.birthdate);
      }
      return events;
    },
    dayRecords() {
      const dayRecords = [];
      const selectedDay = new Date(this.day);
      for (let record of this.$store.state.records) {
        const currentDateTime = new Date(record.fromDate);
        if (
          currentDateTime.getFullYear() <= selectedDay.getFullYear() &&
          currentDateTime.getMonth() <= selectedDay.getMonth() &&
          currentDateTime.getDate() < selectedDay.getDate()
        ) {
          return dayRecords;
        }
        if (
          currentDateTime.getFullYear() === selectedDay.getFullYear() &&
          currentDateTime.getMonth() === selectedDay.getMonth() &&
          currentDateTime.getDate() === selectedDay.getDate()
        ) {
          dayRecords.push(record);
        }
      }
      return dayRecords;
    }
  },
  methods: {
    time,
    duration
  }
};
</script>
