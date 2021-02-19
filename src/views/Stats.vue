<template>
  <v-container>
    <v-slide-group v-model="activeTypeIndex" center-active>
      <v-slide-item
        v-for="type in $store.state.config.types"
        :key="type.id"
        v-slot="{ active, toggle }"
      >
        <v-btn
          :color="type.color"
          :depressed="active"
          :outlined="!active"
          class="ma-1 px-md-12 px-lg-16 big-type"
          @click="toggle"
        >
          <v-icon
            v-text="type.icon"
            :color="active ? 'secondary' : null"
          ></v-icon>
        </v-btn>
      </v-slide-item>
    </v-slide-group>
    <h2
      class="primary--text mt-6 mb-3"
      :style="{
        color: activeType.id !== 'ALL' ? `${activeType.color} !important` : ''
      }"
    >
      {{ activeType.name }}
    </h2>

    <v-row v-if="activeType.id === 'GROWTH'" class="mb-4">
      <v-col v-if="!validChild">
        <dialog-child :value="activeChild">
          <v-alert type="info">
            Add birthdate and gender to {{ activeChild.name }} to see height and
            weight charts.
            <v-btn outlined>Add Now</v-btn>
          </v-alert>
        </dialog-child>
      </v-col>
      <v-col cols="12" md="6" v-if="validChild">
        <chart-growth type="weight"></chart-growth>
      </v-col>
      <v-col cols="12" md="6" v-if="validChild">
        <chart-growth type="height"></chart-growth>
      </v-col>
    </v-row>
    <v-card outlined class="chart-schedule">
      <v-card-title class="primary--text mb-2">
        Schedule by hours
      </v-card-title>
      <v-card-subtitle>
        <v-icon
          class="type-icon mr-2"
          v-for="subtype in activeType.subtypes"
          v-text="subtype.icon"
          color="secondary"
          :style="{ 'background-color': subtypesColor[subtype.id] }"
          :key="subtype.id"
        ></v-icon>
      </v-card-subtitle>
      <v-card-text>
        <chart-schedule :type="activeType"></chart-schedule>
      </v-card-text>
    </v-card>
    // TODO: #15 charts page
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import ChartSchedule from "@/components/ChartSchedule";
import ChartGrowth from "@/components/ChartGrowth.vue";
import DialogChild from "@/components/DialogChild";

export default {
  name: "Stats",
  components: {
    ChartSchedule,
    ChartGrowth,
    DialogChild
  },
  data() {
    return {
      activeTypeIndex: undefined,
      chart: null
    };
  },
  computed: {
    ...mapGetters(["subtypesColor", "activeChild"]),
    activeType() {
      if (this.activeTypeIndex === undefined) {
        return {
          id: "ALL",
          name: "All in One"
        };
      }
      return this.$store.state.config.types[this.activeTypeIndex];
    },
    validChild() {
      return (
        this.activeChild &&
        this.activeChild.birthdate &&
        ["F", "M"].includes(this.activeChild.gender)
      );
    }
  },
  watch: {
    activeType() {
      const slug = this.activeType.id === "ALL" ? "" : `/${this.activeType.id}`;
      const path = `/stats${slug}`;
      if (path !== this.$route.path) {
        this.$router.push(path);
      }
    },
    $route: {
      handler() {
        const activeTypeIndex = this.$store.state.config.types
          .map((type) => type.id)
          .indexOf(this.$route.params.typeId);
        this.activeTypeIndex =
          activeTypeIndex === -1 ? undefined : activeTypeIndex;
      },
      immediate: true
    }
  }
};
</script>
<style scoped>
.theme--dark.v-card.chart-schedule {
  background: #424242 !important;
}
</style>
