<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :max-width="$store.state.ui.dialogFullscreenMaxWidth"
    scrollable
    hide-overlay
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        depressed
        block
        color="primary"
        class="secondary--text"
        >All Logs</v-btn
      >
    </template>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="secondary" flat>
          <v-btn @click="dialog = false" icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>All Logs</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon v-if="isEditActive" @click="removeSelected()">
            <v-icon>mdi-delete-sweep-outline</v-icon>
          </v-btn>
          <v-btn icon @click="isEditActive = !isEditActive">
            <v-icon>mdi-pencil-box-multiple-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            @click="dialog = false"
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="min-height">
        <div v-for="(group, i) in groupedRecordsPaged" :key="i">
          <h2 class="primary--text subtitle-1">{{ group.day }}</h2>
          <v-list dense class="extra-dense mb-2">
            <v-list-item
              v-for="(record, i) in group.records"
              :key="i"
              @click.stop="
                $store.commit('updateUI', { showRecordDialog: record })
              "
            >
              <v-list-item-action v-if="isEditActive">
                <v-checkbox @click.stop="toggleSelection(record)"></v-checkbox>
              </v-list-item-action>
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
                  <strong>{{ record.time() }}</strong>
                  {{ subtypeLookup[record.subtype].name }}
                  <span v-if="record.toDate">, {{ record.duration() }}</span>
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
        </div>
        <v-btn
          block
          text
          color="primary"
          v-if="nbDaysHistory < groupedRecords.length"
          @click="nbDaysHistory += defaultNbDaysHistory"
          >Load More</v-btn
        >
      </v-card-text>
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
      defaultNbDaysHistory,
      selection: [],
      isEditActive: false
    };
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"]),
    groupedRecordsPaged() {
      return this.groupedRecords.slice(0, this.nbDaysHistory);
    },
    groupedRecords() {
      let lastDateTime = new Date();
      const today = new Date();
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
          currentDateTime.getDate() !== lastDateTime.getDate()
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
  },
  methods: {
    toggleSelection(record) {
      const index = this.selection.indexOf(record);
      if (index >= 0) {
        this.selection.splice(index, 1);
      } else {
        this.selection.push(record);
      }
    },
    async removeSelected() {
      for (let i = 0; i < this.selection.length; i++) {
        await this.$store.dispatch("removeRecord", this.selection[i]);
      }
      this.selection = [];
    }
  }
};
</script>
<style scoped>
.min-height {
  min-height: 50vh;
}
</style>
