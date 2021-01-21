<template>
  <v-dialog fullscreen hide-overlay v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary">
        <v-btn @click="dialog = false" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <dialog-child
        v-for="child in $store.state.children"
        :key="child.id"
        :value="child"
      >
        {{ child.name }}
      </dialog-child>
      <dialog-child>Add Child</dialog-child>
      <v-text-field
        label="remote url"
        v-model="remoteURL"
        placeholder="https://login:password@host:5984/dbname"
        hint="dbname-children and dbname-records must be writable"
        :type="showRemoteURL ? 'text' : 'password'"
        @focus="showRemoteURL = true"
        @blur="showRemoteURL = false"
      >
        <template v-slot:append-outer>
          <v-btn depressed large @click="sync()"> sync </v-btn>
        </template>
      </v-text-field>
      <div v-if="$store.state.remoteURL">
        <v-icon :color="$store.state.syncStatus.children ? 'green' : 'grey'"
          >mdi-sync</v-icon
        >
        children
        <v-icon :color="$store.state.syncStatus.records ? 'green' : 'grey'"
          >mdi-sync</v-icon
        >
        records
      </div>
      <v-btn @click="exportDB()">exportDB</v-btn>
      TODO importDump
      <v-file-input
        label="Import Amila BabyTracker"
        truncate-length="15"
        v-model="importFile"
        @change="importAmila($event)"
      ></v-file-input>
      / import other preference?<br />
      about/ licenses<br />
      <v-text-field
        label="Weight"
        :value="$store.state.config.units.weight"
        @change="$store.commit('setUnits', { weight: $event })"
      >
      </v-text-field>
      <v-text-field
        label="Length"
        :value="$store.state.config.units.length"
        @change="$store.commit('setUnits', { length: $event })"
      >
      </v-text-field>
      <v-text-field
        label="Volume"
        :value="$store.state.config.units.volume"
        @change="$store.commit('setUnits', { volume: $event })"
      >
      </v-text-field>
      <v-text-field
        label="Temperature"
        :value="$store.state.config.units.temperature"
        @change="$store.commit('setUnits', { temperature: $event })"
      >
      </v-text-field>
      <v-list three-line subheader>
        <v-subheader>User Con trols</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Content filtering</v-list-item-title>
            <v-list-item-subtitle
              >Set the content filtering level to restrict apps that can be
              downloaded</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Password</v-list-item-title>
            <v-list-item-subtitle
              >Require password for purchase or use password to restrict
              purchase</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list three-line subheader>
        <v-subheader>General</v-subheader>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="notifications"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Notifications</v-list-item-title>
            <v-list-item-subtitle
              >Notify me about updates to apps or games that I
              downloaded</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="sound"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sound</v-list-item-title>
            <v-list-item-subtitle
              >Auto-update apps at any time. Data charges may
              apply</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="widgets"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Auto-add widgets</v-list-item-title>
            <v-list-item-subtitle
              >Automatically add home screen widgets</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<script>
import DialogChild from "@/components/DialogChild";
import { saveAs } from "file-saver";
import DatabaseService from "@/services/Database";

export default {
  name: "DialogSettings",
  components: {
    DialogChild
  },
  data() {
    return {
      dialog: false,
      showRemoteURL: false,
      remoteURL: this.$store.state.remoteURL,
      importFile: undefined,
      notifications: false,
      sound: false,
      widgets: false
    };
  },
  methods: {
    async exportDB() {
      const db = await DatabaseService.get();
      const json = await db.dump();
      const text = JSON.stringify(json, undefined, 2);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "export.json");
    },
    async importAmila(file) {
      if (!file) return;
      try {
        const json = await file.text();
        const result = JSON.parse(json);
        result.records.forEach(async (record) => {
          if (record.type === "SLEEPING") {
            record.subtype = "SLEEPING";
          }
          if (record.fromDate) {
            record.fromDate = new Date(record.fromDate).toISOString();
          }
          if (record.toDate) {
            record.toDate = new Date(record.toDate).toISOString();
          }
          if (record.unit === "NONE") {
            delete record.unit;
          }
          if (record.unit === "MILLILITRES") {
            record.unit = "ml";
          }
          if (record.unit === "CENTIMETERS") {
            record.unit = "cm";
          }
          if (record.unit === "KILOGRAMS") {
            record.unit = "kg";
          }
          if (record.unit === "CELSIUS") {
            record.unit = "°C";
          }
          if (record.details === "") {
            delete record.details;
          }
          const rxRecord = await this.$store.dispatch("createRecord", record);
          rxRecord.save();
        });
        this.importFile = undefined;
        this.dialog = false;
      } catch (e) {
        console.log(e);
      }
    },
    sync() {
      this.$store.dispatch("setRemoteURL", this.remoteURL);
    }
  }
};
</script>
