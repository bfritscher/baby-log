import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home"
  },
  {
    path: "/stats/:typeId",
    name: "Stats"
  },
  {
    path: "/calendar",
    name: "Calendar"
  },
  {
    path: "/settings",
    name: "Settings"
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
