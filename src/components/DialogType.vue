<template>
  <v-dialog
    fullscreen
    hide-overlay
    :value="type"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="type">
      <v-toolbar :color="type.color">
        <v-btn @click="close()" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ type.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click.stop="
            $store.commit('updateUI', { showRecordDialog: { type: type.id } })
          "
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <div v-if="type && !(subtype || timer)">
        <v-btn
          class="btn-icon"
          v-for="subtype in type.subtypes"
          :key="subtype.id"
          @click="selectSubtype(subtype)"
          rounded
          elevation="0"
        >
          <v-icon
            v-text="subtype.icon"
            :style="{ 'background-color': type.color }"
          ></v-icon>
          {{ subtype.name }}
        </v-btn>
      </div>
      <div v-else>
        <v-btn class="btn-icon" rounded elevation="0">
          <v-icon
            v-text="subtype.icon"
            :style="{ 'background-color': type.color }"
          ></v-icon>
          {{ subtype.name }}
        </v-btn>
        <span v-if="timer">
          <timer :from-date="timer.fromDate"></timer>
        </span>
        <v-btn icon @click="showDetails = !showDetails"
          ><v-icon>mdi-pen</v-icon></v-btn
        >
        <div v-if="subtype.withAmount">
          <v-btn icon @click="changeAmount(-1)" :disabled="amount === 0">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn icon @click="changeAmount(1)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-text-field
            type="number"
            min="0"
            label="Amount"
            v-model.number="amount"
          ></v-text-field>
          <v-text-field type="text" label="Unit" v-model="unit"></v-text-field>
        </div>
      </div>
      <v-text-field
        type="text"
        label="Details"
        placeholder="Optional details"
        v-model="details"
        v-if="showDetails"
      ></v-text-field>
      <v-btn block v-if="timer" @click="endTimer()">Finish</v-btn>

      <div
        v-if="!timer && subtype && (subtype.withAmount || subtype.askDetail)"
      >
        <v-btn block @click="createRecord()">Save</v-btn>
        <v-btn @click="currentSubtype = undefined">Cancel</v-btn>
      </div>
      // TODO make stick
      <div v-for="(day, i) in timelineRecordsPaged" :key="i">
        <p>{{ day.day }}</p>
        <v-timeline dense align-top>
          <template v-for="(record, i) in day.records">
            <v-timeline-item hide-dot v-if="record.durationBetween" :key="i">
              {{ record.durationBetween }}
            </v-timeline-item>
            <v-timeline-item
              v-else
              :value="record"
              :key="i"
              fill-dot
              :color="typeLookup[record.type].color"
              :icon="
                subtypeLookup[
                  record.subtype === 'NONE' ? record.type : record.subtype
                ].icon
              "
            >
              <v-row
                class="pt-1"
                @click.stop="
                  $store.commit('updateUI', { showRecordDialog: record })
                "
              >
                <v-col cols="1">
                  <strong>{{ record.time() }}</strong>
                </v-col>
                <v-col>
                  <strong>{{ subtypeLookup[record.subtype].name }}</strong>
                  <div class="caption">
                    {{ record.duration() }}
                    <span
                      v-if="
                        subtypeLookup[record.subtype].withAmount &&
                        record.amount
                      "
                    >
                      {{ record.amount }}{{ record.unit }}
                    </span>
                    {{ record.details }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </template>
        </v-timeline>
      </div>
      <v-btn
        v-if="nbDaysHistory < timelineRecords.length"
        @click="nbDaysHistory += defaultNbDaysHistory"
        >Load More</v-btn
      >
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import Timer from "@/components/Timer";

import moment from "moment";

export default {
  name: "DialogType",
  data() {
    const defaultNbDaysHistory = 3;
    return {
      showDetails: false,
      details: "",
      amount: undefined,
      unit: undefined,
      currentSubtype: undefined,
      nbDaysHistory: defaultNbDaysHistory,
      defaultNbDaysHistory
    };
  },
  components: {
    Timer
  },
  watch: {
    type() {
      if (!this.type) {
        this.showDetails = false;
        this.currentSubtype = undefined;
        this.nbDaysHistory = this.defaultNbDaysHistory;
      }
    },
    subtype() {
      if (!this.currentSubtype) {
        this.showDetails = false;
        this.details = "";
      } else {
        this.amount = undefined;
        this.unit = this.subtype
          ? this.$store.state.config.units[this.subtype.unit]
          : undefined;
      }
    }
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    type() {
      return this.$store.state.ui.showTypeDialog;
    },
    timer() {
      return this.$store.state.timers.find((record) => {
        return record.type === this.type.id;
      });
    },
    subtype() {
      return (
        this.currentSubtype ||
        (this.timer && this.subtypeLookup[this.timer.subtype])
      );
    },
    timelineRecordsPaged() {
      return this.timelineRecords.slice(0, this.nbDaysHistory);
    },
    timelineRecords() {
      if (this.type) {
        const filteredRecords = this.$store.state.records.filter(
          (r) => !r.timer && r.type == this.type?.id
        );
        let lastDateTime = new Date();
        const today = new Date(new Date().toDateString());
        let dayRecords = [];
        const days = [
          {
            day: "Today",
            records: dayRecords
          }
        ];

        for (let record of filteredRecords) {
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
          const duration = lastDateTime - currentDateTime;
          if (duration > 5 * 3600) {
            dayRecords.push({
              durationBetween: moment.duration(duration).humanize()
            });
          }

          dayRecords.push(record);
          lastDateTime = currentDateTime;
        }
        return days.filter((d) => d.records.length > 0);
      }
      return [];
    }
  },
  methods: {
    changeAmount(direction) {
      if (!this.amount) {
        this.amount = 0;
      }
      this.amount +=
        direction * this.$store.state.config.unitsIncrements[this.subtype.unit];
      if (this.amount < 0) {
        this.amount = 0;
      }
    },
    selectSubtype(subtype) {
      this.currentSubtype = subtype;
      if (!subtype.withTimer && (subtype.withAmount || subtype.askDetail)) {
        if (subtype.askDetail) {
          this.showDetails = true;
        }
        // manually add the record with save button
        return;
      }
      // auto create for timer or auto add
      this.createRecord();
    },
    async createRecord() {
      const record = {
        type: this.type.id,
        subtype: this.subtype.id,
        fromDate: new Date().toISOString()
      };
      if (this.details) {
        record.details = this.details;
      }
      if (this.subtype.withTimer) {
        record.timer = true;
      }
      if (this.subtype.withAmount) {
        record.unit = this.unit;
        record.amount = this.amount;
      }
      const rxDocument = await this.$store.dispatch("createRecord", record);
      rxDocument.save();
      this.currentSubtype = null;
    },
    endTimer() {
      const updates = {
        toDate: new Date().toISOString(),
        details: this.details,
        timer: undefined
      };
      if (this.subtype.withAmount) {
        updates.unit = this.unit || "";
        updates.amount = this.amount || 0;
      }
      this.timer.atomicPatch(updates);
    },
    close() {
      this.$store.commit("updateUI", { showTypeDialog: false });
    }
  }
};
</script>
