<template>
  <div @click.stop="$store.commit('updateUI', { showTypeDialog: type })">
    <v-icon
      v-text="subtype.icon"
      :style="{ 'background-color': type.color }"
    ></v-icon>
    <span>{{ ago() }}</span>
    <span>, {{ subtype.name }}</span>
    <span v-if="subtype.withAmount && record.amount"
      >, {{ record.amount }}{{ record.unit }}</span
    >
    <span v-if="subtype.withTimer">, {{ record.duration() }}</span>
  </div>
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
