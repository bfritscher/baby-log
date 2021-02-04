<template>
  <v-list dense>
    <v-list-item
      v-for="group in dayGroup"
      :key="group.type"
      @click.stop="$store.commit('updateUI', { showTypeDialog: group.type })"
    >
      <v-list-item-icon class="my-1 mr-3">
        <v-icon
          class="type-icon"
          color="secondary"
          v-text="typeLookup[group.type].icon"
          :style="{ 'background-color': typeLookup[group.type].color }"
        ></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ group.count }} times
          <span v-if="group.totalDuration > 0"
            >, {{ duration(group.totalDuration) }}</span
          >
          <span v-if="group.totalAmount > 0"
            >, {{ group.totalAmount }} ml
          </span>
          <span v-for="subgroup in group.subtypes" :key="subgroup.subtype"
            >, {{ subgroup.count }} {{ subtypeLookup[subgroup.subtype].name }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
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
  computed: {
    ...mapGetters(["typeLookup", "subtypeLookup"])
  },
  watch: {
    day() {
      this.subscribe();
    }
  },
  mounted() {
    this.subscribe();
  },
  beforeDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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
