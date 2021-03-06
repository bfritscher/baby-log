<template>
  <v-dialog
    persistent
    v-model="dialog"
    :max-width="$store.state.ui.dialogMaxWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <div v-on="on" v-bind="attrs">
        <slot></slot>
      </div>
    </template>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="secondary" flat>
          <v-toolbar-title>{{
            create ? "Add Child" : "Edit Child"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="remove()" v-if="!create">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container v-if="child">
          <v-text-field
            dense
            single-line
            filled
            hide-details
            type="text"
            prepend-icon="mdi-account"
            placeholder="Name"
            v-model="child.name"
          ></v-text-field>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="child.birthdate"
                placeholder="Birthday date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              dense
              single-line
              filled
              ref="picker"
              v-model="child.birthdate"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="setBirthdate"
            ></v-date-picker>
          </v-menu>
          <v-select
            prepend-icon="mdi-gender-male-female"
            placeholder="Gender"
            dense
            single-line
            filled
            :items="genders"
            v-model="child.gender"
          ></v-select>
          <span v-if="!create">id: {{ child.id }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel()"> Cancel </v-btn>
        <v-btn color="primary" text @click="save()">{{
          create ? "Add" : "Update"
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isRxDocument } from "rxdb/plugins/core";
import { MALE, FEMALE } from "@/schemas/child";

export default {
  name: "DialogChild",
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      dialog: false,
      child: {},
      menu: false,
      genders: [
        {
          text: "-",
          value: ""
        },
        {
          text: "♂️ Boy",
          value: MALE
        },
        {
          text: "♀️ Girl",
          value: FEMALE
        }
      ]
    };
  },
  computed: {
    create() {
      return !isRxDocument(this.value);
    }
  },
  watch: {
    value() {
      this.updateChild();
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    dialog() {
      this.updateChild();
    }
  },
  methods: {
    setBirthdate(date) {
      this.$refs.menu.save(date);
    },
    async updateChild() {
      if (!this.dialog) {
        return;
      }
      let value = this.value;
      if (!isRxDocument(value)) {
        // used to generate id
        value = await this.$store.dispatch("createChild", value);
      }
      this.child = Object.assign(
        {
          birthdate: undefined,
          gender: "",
          name: "",
          alarms: []
        },
        value.toJSON ? value.toJSON() : JSON.parse(JSON.stringify(value))
      );
    },
    save() {
      this.$store.dispatch("upsertChild", this.child);
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    },
    remove() {
      if (window.confirm(`Delete ${this.child.name} and its records?`)) {
        this.$store.dispatch("removeChild", this.child);
        this.dialog = false;
      }
    }
  }
};
</script>
