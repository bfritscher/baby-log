<template>
  <v-dialog
    persistent
    :value="value"
    :max-width="$store.state.ui.dialogMaxWidth"
  >
    <v-card>
      <v-toolbar :color="type.color" flat>
        <v-toolbar-title class="secondary--text">{{
          type.name
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="remove()" v-if="!create" icon>
          <v-icon color="secondary">mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container v-if="currentRecord">
          <date-time-picker
            :color="type.color"
            :time-icon="
              subtype.withTimer
                ? 'mdi-clock-start'
                : 'mdi-clock-time-four-outline'
            "
            v-model="currentRecord.fromDate"
          ></date-time-picker>
          <date-time-picker
            :color="type.color"
            v-if="subtype.withTimer"
            :time-icon="'mdi-clock-end'"
            v-model="currentRecord.toDate"
          ></date-time-picker>
          <span v-if="!fromBeforeTo"> Finish must be after Start! </span>
          <v-select
            :color="type.color"
            dense
            single-line
            filled
            label="Type"
            v-if="type && type.subtypes && type.subtypes.length > 1"
            v-model="currentRecord.subtype"
            :items="type.subtypes"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          >
            <template v-slot:item="data">
              <v-list-item-icon>
                <v-icon
                  class="type-icon"
                  color="secondary"
                  :style="{ 'background-color': type.color }"
                  v-text="data.item.icon"
                ></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-slot:prepend>
              <v-icon
                class="type-icon"
                color="secondary"
                :style="{ 'background-color': type.color }"
                v-text="subtype.icon"
              ></v-icon>
            </template>
          </v-select>
          <v-row v-if="subtype.withAmount">
            <v-col cols="8">
              <v-text-field
                dense
                single-line
                filled
                :color="type.color"
                type="number"
                placeholder="Amount"
                v-model.number="currentRecord.amount"
                :prepend-icon="unitIcon"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                dense
                single-line
                filled
                :color="type.color"
                type="text"
                placeholder="Unit"
                v-model="currentRecord.unit"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            :color="type.color"
            dense
            filled
            single-line
            type="text"
            placeholder="Optional details"
            prepend-icon="mdi-pencil"
            v-model="currentRecord.details"
          ></v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel()"> Cancel </v-btn>
        <v-btn
          color="primary"
          text
          @click="save()"
          :disabled="!currentRecord.subtype || !fromBeforeTo"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { isRxDocument } from "rxdb/plugins/core";
import DateTimePicker from "@/components/DateTimePicker";

export default {
  name: "DialogRecord",
  components: {
    DateTimePicker
  },
  data() {
    return {
      currentRecord: {},
      rules: {
        required: (value) => !!value || "Required."
      }
    };
  },
  computed: {
    type() {
      return this.$store.getters.typeLookup[this.currentRecord.type] || {};
    },
    subtype() {
      return (
        this.$store.getters.subtypeLookup[this.currentRecord.subtype] || {}
      );
    },
    create() {
      return !isRxDocument(this.value);
    },
    value() {
      return this.$store.state.ui.showRecordDialog;
    },
    fromBeforeTo() {
      if (this.subtype && this.subtype.withTimer && this.currentRecord.toDate) {
        const fromDate = new Date(this.currentRecord.fromDate).getTime();
        const toDate = new Date(this.currentRecord.toDate).getTime();
        if (toDate - fromDate < 0) {
          return false;
        }
      }
      return true;
    },
    unitIcon() {
      if (this.subtype && this.subtype.withAmount) {
        return this.$store.state.ui.unitsIcon[this.subtype.unit];
      }
      return "";
    }
  },
  watch: {
    value() {
      this.updateCurrentRecord();
    },
    "currentRecord.subtype"() {
      this.currentRecord.unit = this.subtype.unit
        ? this.$store.state.config.units[this.subtype.unit]
        : "";
    }
  },
  methods: {
    async updateCurrentRecord() {
      if (!this.value) {
        return;
      }
      let value = this.value;
      if (!isRxDocument(value) && this.$store.state.ui.liteMode && !value._id) {
        // used to generate id
        if (value.type && !value.subtype) {
          const subtypes = this.$store.getters.typeLookup[
            value.type
          ].subtypes.map((subtype) => subtype.id);
          if (subtypes.length > 0) {
            value.subtype = subtypes[0];
          }
        }
        value = await this.$store.dispatch("createRecord", value);
      }
      this.currentRecord = Object.assign(
        {
          type: "",
          subtype: "",
          fromDate: new Date().toISOString(),
          toDate: new Date().toISOString(),
          amount: undefined,
          unit: this.subtype.unit
            ? this.$store.state.config.units[this.subtype.unit]
            : "",
          details: "",
          category: ""
        },
        value.toJSON ? value.toJSON() : JSON.parse(JSON.stringify(value))
      );
    },
    save() {
      if (!this.subtype.withTimer) {
        this.currentRecord.toDate = undefined;
      }
      if (!this.subtype.withAmount) {
        this.currentRecord.amount = undefined;
        this.currentRecord.unit = undefined;
      }
      if (this.create) {
        // TODO lite mode?
        this.currentRecord.timer = undefined;
      }
      this.$store.dispatch("upsertRecord", this.currentRecord);
      this.close();
    },
    cancel() {
      this.close();
    },
    remove() {
      this.$store.dispatch("removeRecord", this.currentRecord);
      this.close();
    },
    close() {
      this.$store.commit("updateUI", { showRecordDialog: false });
    }
  }
};
</script>
