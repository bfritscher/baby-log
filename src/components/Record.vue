<template>
  <v-list-item
    @click.stop="$store.commit('updateUI', { showTypeDialog: type })"
  >
    <v-list-item-icon class="my-1 mr-3">
      <v-icon
        class="type-icon"
        v-text="subtype.icon"
        :style="{ 'background-color': type.color }"
      ></v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        <span>{{ ago() }}</span>
        <span>, {{ subtype.name }}</span>
        <span v-if="subtype.withAmount && record.amount"
          >, {{ record.amount }}{{ record.unit }}</span
        >
        {{ record.details }}
        <span v-if="subtype.withTimer">, {{ record.duration() }}</span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import moment from "moment";

export default {
  name: "Record",
  props: ["record"],
  computed: {
    type() {
      return this.$store.getters.typeLookup[this.record.type] || {};
    },
    subtype() {
      return this.$store.getters.subtypeLookup[this.record.subtype] || {};
    }
  },
  methods: {
    ago() {
      return moment(this.record.fromDate).fromNow();
    }
  }
};
</script>
