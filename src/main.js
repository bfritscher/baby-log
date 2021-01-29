import Vue from "vue";
import moment from "moment";

import "./plugins/sentry";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import App from "./App.vue";

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 1);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 24);
moment.relativeTimeThreshold("d", 7);
moment.relativeTimeThreshold("w", 4);
moment.relativeTimeThreshold("M", 12);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    this.$vuetify.theme.dark = this.$store.state.ui.darkMode;
  },
  watch: {
    "$store.state.ui.darkMode"() {
      this.$vuetify.theme.dark = this.$store.state.ui.darkMode;
    }
  }
}).$mount("#app");
