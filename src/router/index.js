import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Meeting from "../views/Meeting.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/meeting/:view?", name: "Meeting", component: Meeting },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
