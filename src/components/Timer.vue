<template>
  <span>{{ elapsedTime }}</span>
</template>

<script>
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

export default {
  name: "Timer",
  props: ["fromDate"],
  data() {
    return {
      elapsedTime: "",
      cancelId: undefined
    };
  },
  mounted() {
    this.updateElapsedTime();
  },
  unmounted() {
    if (this.cancelId) {
      window.cancelAnimationFrame(this.cancelId);
    }
  },
  computed: {
    fromDateTime() {
      return Math.floor(new Date(this.fromDate).getTime() / 1000);
    }
  },
  methods: {
    updateElapsedTime() {
      this.elapsedTime = formatTime(
        Math.floor(new Date().getTime() / 1000) - this.fromDateTime
      );
      this.cancelId = window.requestAnimationFrame(this.updateElapsedTime);
    }
  }
};
</script>
