import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import Stats from "@/views/Stats";
import Calendar from "@/views/Calendar";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/stats",
    name: "Stats",
    component: Stats
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
