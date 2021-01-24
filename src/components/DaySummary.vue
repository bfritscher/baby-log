<template>
  <div>
    <div
      v-for="group in dayGroup"
      :key="group.type"
      @click.stop="
        $store.commit('updateUI', { showTypeDialog: typeLookup[group.type] })
      "
    >
      <v-icon
        v-text="typeLookup[group.type].icon"
        :style="{ 'background-color': typeLookup[group.type].color }"
      ></v-icon>
      {{ group.count }} times
      <span v-if="group.totalDuration > 0"
        >, {{ duration(group.totalDuration) }}</span
      >
      <span v-if="group.totalAmount > 0">, {{ group.totalAmount }} ml </span>
      <span v-for="subgroup in group.subtypes" :key="subgroup.subtype">
        , {{ subgroup.count }} {{ subtypeLookup[subgroup.subtype].name }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import groupRecords from "@/services/groupRecords";

export default {
  name: "DaySummary",
  props: ["day"],
  data() {
    return {
      dayGroup: {},
      sub: undefined
    };
  },
  mounted() {
    this.subscribe();
  },
  watch: {
    day() {
      this.subscribe();
    }
  },
  beforeDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  },
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"])
  },
  methods: {
    async subscribe() {
      if (this.sub) {
        this.sub.unsubscribe();
      }
      const query = await this.$store.dispatch("getRecordsOfDay", this.day);
      this.sub = query.$.subscribe((records) => {
        this.dayGroup = groupRecords(records);
      });
    },
    duration(duration) {
      return moment.duration(duration).humanize();
    }
  }
};
</script>
