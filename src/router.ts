import { createRouter, createWebHistory } from "vue-router";

import ControlList from "@/components/panel/control/ControlList.vue";
import ScheduleControl from "@/components/panel/schedules/ScheduleControl.vue";

const ROUTES = [
    { path: "/panel/control", name: "control", component: ControlList },
    { path: "/panel/schedule", name: "schedule", component: ScheduleControl },
];

export const router = createRouter({
    history: createWebHistory(),
    routes: ROUTES,
});