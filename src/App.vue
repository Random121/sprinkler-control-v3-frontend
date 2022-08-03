<template>
    <TopBar></TopBar>
    <ControlList></ControlList>
    <DaySelector v-model="days"></DaySelector>
</template>

<script setup lang="ts">
import TopBar from "@/components/topbar/TopBar.vue";
import ControlList from "@/components/panel/control/ControlList.vue";
import DaySelector from "@/components/panel/schedules/DaySelector.vue";
import { ref, watch } from "vue";

const days = ref([]);

watch(days, (d) => console.log(d));
</script>

<style scoped></style>
