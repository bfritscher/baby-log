<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :max-width="$store.state.ui.dialogFullscreenMaxWidth"
    scrollable
    hide-overlay
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="secondary" flat>
          <v-btn @click="dialog = false" icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            @click="dialog = false"
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-subheader>
          Children
          <v-spacer></v-spacer>
          <dialog-child>
            <v-btn icon class="mr-n2">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </dialog-child>
        </v-subheader>
        <v-list>
          <template v-for="child in $store.state.children">
            <dialog-child :value="child" :key="`d${child.id}`">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ child.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-list-item-action>
              </v-list-item>
            </dialog-child>
            <v-divider :key="child.id"></v-divider>
          </template>
        </v-list>

        <v-subheader>
          Alarms
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click.stop="
              $store.commit('updateUI', {
                showAlarmDialog: { type: 'FEEDING', enabled: true }
              })
            "
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-subheader>
        <v-list>
          <template v-for="alarm in alarms">
            <v-list-item
              @click.stop="
                $store.commit('updateUI', {
                  showAlarmDialog: alarm
                })
              "
              :key="alarm.id"
            >
              <v-list-item-icon class="my-1 mr-3">
                <v-icon
                  color="secondary"
                  class="type-icon"
                  v-text="
                    alarm.subtype
                      ? subtypeLookup[alarm.subtype].icon
                      : typeLookup[alarm.type].icon
                  "
                  :style="{
                    'background-color': typeLookup[alarm.type].color
                  }"
                ></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ typeLookup[alarm.type].name }}
                  <span v-if="alarm.subtype">{{
                    subtypeLookup[alarm.subtype].name
                  }}</span>
                  {{ alarm.details }} {{ alarm.intervalAmount }}
                  {{ alarm.intervalType }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="ma-0">
                <v-btn
                  icon
                  @click.stop="
                    $store.commit('updateUI', {
                      showAlarmDialog: alarm
                    })
                  "
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="`d${alarm.id}`"></v-divider>
          </template>
        </v-list>

        <v-subheader>UI Options</v-subheader>
        <v-list>
          <v-list-item>
            <v-list-item-content> Dark Mode </v-list-item-content>
            <v-list-item-action>
              <v-switch
                v-model="$vuetify.theme.dark"
                inset
                hide-details
                color="accent"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-subheader>Measure Units</v-subheader>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  dense
                  single-line
                  filled
                  hide-details
                  placeholder="Weight"
                  :prepend-icon="$store.state.ui.unitsIcon.weight"
                  :value="$store.state.config.units.weight"
                  @change="$store.commit('setUnits', { weight: $event })"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  dense
                  single-line
                  filled
                  hide-details
                  placeholder="Length"
                  :prepend-icon="$store.state.ui.unitsIcon.length"
                  :value="$store.state.config.units.length"
                  @change="$store.commit('setUnits', { length: $event })"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  dense
                  single-line
                  filled
                  hide-details
                  placeholder="Volume"
                  :prepend-icon="$store.state.ui.unitsIcon.volume"
                  :value="$store.state.config.units.volume"
                  @change="$store.commit('setUnits', { volume: $event })"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  dense
                  single-line
                  filled
                  hide-details
                  placeholder="Temperature"
                  :prepend-icon="$store.state.ui.unitsIcon.temperature"
                  :value="$store.state.config.units.temperature"
                  @change="$store.commit('setUnits', { temperature: $event })"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-subheader>Remote Sync</v-subheader>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                label="remote url"
                v-model="remoteURL"
                placeholder="https://login:password@host:5984/dbname"
                hint="dbname-children and dbname-records must be writable"
                :type="showRemoteURL ? 'text' : 'password'"
                @focus="showRemoteURL = true"
                @blur="showRemoteURL = false"
              >
              </v-text-field>
              <div v-if="$store.state.remoteURL">
                <v-icon
                  :color="$store.state.syncStatus.children ? 'green' : 'grey'"
                  >mdi-sync</v-icon
                >
                children
                <v-icon
                  :color="$store.state.syncStatus.records ? 'green' : 'grey'"
                  >mdi-sync</v-icon
                >
                records
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn depressed large @click="sync()"> sync </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-subheader>Import / Export</v-subheader>
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-export</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Local database backup </v-list-item-content>
            <v-list-item-action>
              <v-btn depressed @click="exportDB()">Dump JSON</v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-file-input
                label="Import Amila BabyTracker"
                truncate-length="15"
                v-model="importFile"
                @change="importAmila($event)"
              ></v-file-input>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-subheader>About / Credits</v-subheader>
        <v-list>
          <v-list-item>
            Icons designed by Freepik, bqlqn, Vitaly Gorbachev, Vectors Market,
            Google, Those Icons, Good Ware, hirschwolf from Flaticon Application
            inspired by Baby tracker - feeding, sleep and diaper from Amila
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import DialogChild from "@/components/DialogChild";
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
  computed: {
    ...mapGetters(["alarms", "typeLookup", "subtypeLookup"])
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.name === "Settings") {
          this.dialog = true;
        }
      },
      immediate: true
    }
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
