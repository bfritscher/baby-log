<template>
  <v-dialog persistent :value="value" max-width="600px">
    <v-card>
      <v-toolbar :color="type.color">
        <v-toolbar-title>{{ type.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-container v-if="currentRecord">
          <date-time-picker
            :label="subtype.withTimer ? 'Start' : 'Date'"
            v-model="currentRecord.fromDate"
          ></date-time-picker>
          <date-time-picker
            v-if="subtype.withTimer"
            label="Finish"
            v-model="currentRecord.toDate"
          ></date-time-picker>
          <span v-if="!fromBeforeTo"> Finish must be after Start! </span>
          <v-select
            label="Type"
            v-if="type && type.subtypes && type.subtypes.length > 1"
            v-model="currentRecord.subtype"
            :items="type.subtypes"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            v-if="subtype.withAmount"
            type="number"
            label="Amount"
            v-model.number="currentRecord.amount"
          ></v-text-field>
          <v-text-field
            v-if="subtype.withAmount"
            type="text"
            label="Unit"
            v-model="currentRecord.unit"
          ></v-text-field>
          <v-text-field
            type="text"
            label="Details"
            placeholder="Optional details"
            v-model="currentRecord.details"
          ></v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="remove()" v-if="!create"> Delete </v-btn>
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
      if (!isRxDocument(value)) {
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
        value.toJSON()
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
