<template>
    <div class="schedule-control">
        <div class="editor">
            <select class="editor__dropdown" v-model="selectedScheduleId">
                <option disabled value="">Select a schedule</option>
                <option
                    v-for="schedule in allSchedules"
                    :key="schedule._id"
                    :value="schedule._id"
                >
                    {{ schedule.name }}
                </option>
            </select>
            <template
                v-if="
                    selectedScheduleId === '' && selectedSchedule !== undefined
                "
            >
                <button @click="saveNewSchedule">Save New Schedule</button>
                <button @click="deleteNewSchedule">Delete New Schedule</button>
            </template>
            <template v-else>
                <button @click="deleteUpdate">Delete</button>
                <button @click="addSchedule">New</button>
            </template>
        </div>
        <div class="settings" v-show="selectedSchedule !== undefined">
            <div class="settings__active-toggle">
                <span>Active:</span>
                <ToggleButton
                    v-model="scheduleActive"
                    @change="sendScheduleActiveStateUpdate"
                ></ToggleButton>
            </div>
            <div class="settings__day-selector">
                <span>Active Days</span>
                <DaySelector
                    v-model="scheduleDays"
                    @change="sendSettingsUpdate"
                ></DaySelector>
            </div>
        </div>
        <TaskEditor
            v-show="selectedSchedule !== undefined"
            :tasks="scheduleTasks"
            @save="sendTaskUpdate"
        ></TaskEditor>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from "vue";

import DaySelector from "./DaySelector.vue";
import ToggleButton from "@/components/lib/ToggleButton.vue";
import TaskEditor from "./TaskEditor.vue";

import { ScheduleApiClient } from "@/utils/ScheduleApiClient";
import type {
    Schedule,
    ScheduleTask,
    EditableSchedule,
} from "@/types/schedule.types";

const SCHEDULES_API_ENDPOINT = inject<string>("SCHEDULES_API_ENDPOINT");

if (!SCHEDULES_API_ENDPOINT) {
    alert("Failed to get schedules endpoint. Refreshing in 3 seconds.");
    setTimeout(() => window.location.reload(), 3000);
}

const scheduleApi = new ScheduleApiClient(SCHEDULES_API_ENDPOINT as string);

let editingNewSchedule = false;

const allSchedules = ref<Schedule[]>([]);
const selectedScheduleId = ref<string>("");
const selectedSchedule = ref<EditableSchedule>();

const scheduleActive = ref<boolean>(false);
const scheduleDays = ref<number[]>([]);
const scheduleTasks = ref<ScheduleTask[]>([]);

watch(selectedScheduleId, () => {
    if (editingNewSchedule) {
        return;
    }

    const schedule = allSchedules.value?.find(
        (s) => s._id === selectedScheduleId.value
    );

    if (!schedule) {
        selectedSchedule.value = undefined;
        return;
    }

    // clone the schedule and remove _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...scheduleCopy } = schedule;

    scheduleActive.value = scheduleCopy.active;
    scheduleDays.value = scheduleCopy.days;
    scheduleTasks.value = scheduleCopy.tasks;

    selectedSchedule.value = scheduleCopy;
});

function updateScheduleStore() {
    scheduleApi
        .getSchedules()
        .then((response) => {
            if (!response.ok) {
                throw new Error("Get schedules request failed");
            }
            return response.json();
        })
        .then((schedules) => (allSchedules.value = schedules))
        .catch((err) => {
            console.log(err);
            alert("Failed to get schedules. Refreshing in 3 seconds.");
            setTimeout(() => window.location.reload(), 3000);
        });
}

function deleteUpdate() {
    const wantDelete = confirm("Do you want to delete this schedule?");

    if (!wantDelete) {
        return;
    }

    scheduleApi
        .deleteSchedule(selectedScheduleId.value)
        .then(() => {
            selectedScheduleId.value = "";
            selectedSchedule.value = undefined;
            updateScheduleStore();
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to delete schedule.");
        });
}

function sendSettingsUpdate() {
    if (!selectedSchedule.value) {
        return;
    }

    selectedSchedule.value.days = scheduleDays.value;

    if (editingNewSchedule) {
        return;
    }

    scheduleApi
        .updateSchedule(selectedScheduleId.value, selectedSchedule.value)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Send settings request failed");
            }
            updateScheduleStore();
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to save settings.");
        });
}

function sendScheduleActiveStateUpdate() {
    if (!selectedSchedule.value) {
        return;
    }

    selectedSchedule.value.active = scheduleActive.value;

    if (editingNewSchedule) {
        return;
    }

    scheduleApi
        .setScheduleActiveState(selectedScheduleId.value, scheduleActive.value)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Send schedule active state request failed");
            }
            updateScheduleStore();
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to set schedule active state.");
        });
}

function sendTaskUpdate(savedTasks: ScheduleTask[]) {
    if (!selectedSchedule.value) {
        return;
    }

    selectedSchedule.value.tasks = savedTasks;

    if (editingNewSchedule) {
        return;
    }

    scheduleApi
        .updateSchedule(selectedScheduleId.value, selectedSchedule.value)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Send task request failed");
            }
            updateScheduleStore();
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to save tasks.");
        });
}

function addSchedule() {
    selectedScheduleId.value = "";

    const scheduleName = prompt("Enter a schedule name:");

    if (!scheduleName) {
        return;
    }

    editingNewSchedule = true;

    selectedSchedule.value = {
        name: scheduleName,
        active: false,
        days: [],
        tasks: [],
    };

    scheduleActive.value = false;
    scheduleDays.value = [];
    scheduleTasks.value = [];
}

function saveNewSchedule() {
    if (!selectedSchedule.value) {
        return;
    }

    editingNewSchedule = false;

    scheduleApi
        .addSchedule(selectedSchedule.value)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Save new schedule request failed");
            }
            selectedScheduleId.value = "";
            selectedSchedule.value = undefined;
            updateScheduleStore();
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to add new schedule.");
        });
}

function deleteNewSchedule() {
    editingNewSchedule = false;
    selectedSchedule.value = undefined;
}

updateScheduleStore();
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

.editor {
    justify-content: space-evenly;

    row-gap: 0.5em;
    column-gap: 1.5em;

    max-width: 30em;
}

.settings {
    justify-content: flex-start;

    row-gap: 1.5em;
    column-gap: 1.5em;

    max-width: 44em;
}

.settings__active-toggle {
    display: flex;
    align-items: center;

    column-gap: 0.75em;
}

.settings__active-toggle > span {
    color: white;
    font-size: 1.1em;
}

.settings__day-selector {
    display: flex;
    flex-direction: column;

    row-gap: 0.75em;
}

.settings__day-selector > span {
    color: white;
    font-size: 1.1em;

    width: fit-content;

    border-bottom: 2px solid white;
}

@media (min-width: 45em) {
    .schedule-control > div {
        width: 100%;
    }
}
</style>
