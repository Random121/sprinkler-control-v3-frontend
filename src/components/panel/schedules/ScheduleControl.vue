<template>
    <div class="schedule-control">
        <div class="schedule-editor">
            <select class="schedule-editor__dropdown">
                <option>Schedule 1</option>
                <option>Schedule 2</option>
            </select>
            <button class="schedule-editor__delete-button">Delete</button>
            <button class="schedule-editor__new-button">New</button>
        </div>
        <div class="schedule-settings">
            <div class="schedule-settings__active-toggle">
                <span>Active:</span>
                <ToggleButton id="test"></ToggleButton>
            </div>
            <div class="schedule-settings__day-selector">
                <span>Active Days</span>
                <DaySelector></DaySelector>
            </div>
        </div>
        <TaskEditor :tasks="TEST" @save="taskSaved"></TaskEditor>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DaySelector from "./DaySelector.vue";
import ToggleButton from "../../lib/ToggleButton.vue";
import TaskEditor from "./TaskEditor.vue";
import type { ScheduleTask } from "@/types/schedule.types";

const TEST = ref([
    {
        id: "GPIO_1",
        start: "00:00:00",
        duration: 10,
    },
    {
        id: "GPIO_2",
        start: "00:10:00",
        duration: 30,
    }
]);

function taskSaved(tasks: ScheduleTask[]) {
    console.log(tasks);
}

</script>

<style scoped>

.schedule-control {
    display: flex;
    flex-flow: column;
    align-items: center;

    row-gap: 1.5em;
}

.schedule-control > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    padding: 1.5em;

    border: 1px solid orange;
    border-radius: 2px;
}

.schedule-editor {
    justify-content: space-evenly;

    row-gap: 0.5em;
    column-gap: 1.5em;

    max-width: 20em;
}

.schedule-settings {
    justify-content: flex-start;

    row-gap: 1.5em;
    column-gap: 1.5em;

    max-width: 44em;
}

.schedule-settings__active-toggle {
    display: flex;
    align-items: center;

    column-gap: 0.75em;
}

.schedule-settings__active-toggle > span {
    color: white;
    font-size: 1.1em;
}

.schedule-settings__day-selector {
    display: flex;
    flex-direction: column;

    row-gap: 0.75em;
}

.schedule-settings__day-selector > span {
    color: white;
    font-size: 1.1em;

    width: fit-content;

    border-bottom: 2px solid white;
}

.schedule-tasks {
    max-width: fit-content;
}

@media (min-width: 45em) {
    .schedule-control > div {
        width: 100%;
    }
}
</style>
