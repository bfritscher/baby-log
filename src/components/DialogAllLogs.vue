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
      // TODO group by day<br />
      // TODO loadMore?
      <div
        v-for="(record, i) in records"
        :key="i"
        @click.stop="$store.commit('updateUI', { showRecordDialog: record })"
      >
        {{ record.type }} {{ record.subtype }}
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DialogAllLogs",
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    records() {
      return this.$store.state.records;
    }
  }
};
</script>
