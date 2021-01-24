<template>
  <v-dialog persistent :value="value" max-width="600px">
    <v-card>
      <v-toolbar :color="type.color">
        <v-toolbar-title>{{ type.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch v-model="alarm.enabled" label="Enabled"></v-switch>
      </v-toolbar>
      <v-card-text>
        <v-container v-if="alarm">
          <v-select
            label="Type"
            v-model="alarm.type"
            :items="types"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-select
            label="Type"
            v-model="alarm.subtype"
            :items="type.subtypes"
            item-text="name"
            item-value="id"
            clearable
          ></v-select>
          <v-text-field
            type="text"
            label="Details"
            placeholder="Optional details"
            v-model="alarm.details"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Interval"
            placeholder="1"
            v-model.number="alarm.intervalAmount"
          ></v-text-field>
          <v-select
            label="Type"
            v-model="alarm.intervalType"
            :items="[
              { text: 'Hour', value: 'h' },
              { text: 'Day', value: 'd' }
            ]"
          ></v-select>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="remove()" v-if="!create"> Delete </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel()"> Cancel </v-btn>
        <v-btn color="primary" text @click="save()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { nanoid } from "nanoid";
import { mapGetters } from "vuex";

export default {
  name: "DialogAlarm",
  data() {
    return {
      alarm: {},
      rules: {
        required: (value) => !!value || "Required."
      }
    };
  },
  computed: {
    ...mapGetters(["alarms"]),
    type() {
      return this.$store.getters.typeLookup[this.alarm.type] || {};
    },
    types() {
      return Object.values(this.$store.getters.typeLookup);
    },
    subtype() {
      return this.$store.getters.subtypeLookup[this.alarm.subtype] || {};
    },
    index() {
      return this.alarms.findIndex((alarm) => {
        return this.alarm.id === alarm.id;
      });
    },
    create() {
      return this.index === -1;
    },
    value() {
      return this.$store.state.ui.showAlarmDialog;
    }
  },
  watch: {
    value() {
      this.updateAlarm();
    }
  },
  methods: {
    async updateAlarm() {
      if (!this.value) {
        return;
      }
      this.alarm = Object.assign(
        {
          id: nanoid(),
          type: "",
          subtype: "",
          details: "",
          intervalAmount: 3,
          intervalType: "h",
          enabled: true
        },
        this.value
      );
    },
    save() {
      const copy = this.alarms.slice(0);
      if (this.alarm.subtype === null) {
        this.alarm.subtype = undefined;
      }
      if (this.create) {
        copy.push(this.alarm);
      } else {
        copy[this.index] = this.alarm;
      }
      this.$store.getters.activeChild.atomicPatch({
        alarms: copy
      });
      this.close();
    },
    cancel() {
      this.close();
    },
    remove() {
      const copy = this.alarms.slice(0);
      copy.splice(this.index, 1);
      this.$store.getters.activeChild.atomicPatch({
        alarms: copy
      });
      this.close();
    },
    close() {
      this.$store.commit("updateUI", { showAlarmDialog: false });
    }
  }
};
</script>
