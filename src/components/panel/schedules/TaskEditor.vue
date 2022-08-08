<template>
    <div class="task-editor">
        <div class="task-editor__control-buttons">
            <button @click="newTask">New Task</button>
            <button @click="saveTasks">Save</button>
        </div>
        <div
            class="task-editor__tasks"
            v-for="(task, index) in tasks"
            :key="index"
        >
            <TaskItem
                :taskInfo="task"
                @change="(newTask) => replaceTask(index, newTask)"
                @delete="deleteTask(index)"
            ></TaskItem>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import type {
    EditableScheduleTask,
    ScheduleTask,
} from "@/types/schedule.types";
import TaskItem from "./TaskItem.vue";

interface Props {
    tasks: ScheduleTask[];
}

interface Emits {
    (emit: "save", tasks: ScheduleTask[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const tasks = ref<EditableScheduleTask[]>(props.tasks);

watch(
    () => props.tasks,
    (newTasks) => (tasks.value = newTasks)
);

function newTask() {
    tasks.value.push({
        id: undefined,
        start: undefined,
        duration: undefined,
    });
}

function replaceTask(taskIndex: number, newTask: EditableScheduleTask) {
    tasks.value[taskIndex] = newTask;
}

function deleteTask(taskIndex: number) {
    tasks.value.splice(taskIndex, 1);
}

const TIME_REGEX = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
function checkValidTask(task: EditableScheduleTask) {
    if (task.id === undefined || task.id.length === 0) {
        return [false, "Task identifier must be specified."];
    }

    if (task.start === undefined || task.start.length === 0) {
        return [false, "Task start time must be specified."];
    }

    if (task.duration === undefined) {
        return [false, "Task duration must be specified."];
    }

    if (!TIME_REGEX.test(task.start)) {
        return [
            false,
            "Task start time must be in HH:mm:ss format (seconds are optional).",
        ];
    }

    if (task.duration <= 0) {
        return [false, "Task duration must be greater than 0 minutes."];
    }

    if (task.duration > 10080) {
        return [
            false,
            "Task duration must be smaller than 10080 minutes (1 week).",
        ];
    }

    return [true, null];
}

function saveTasks() {
    if (tasks.value.length === 0) {
        alert("Schedule must have at least one task.");
        return;
    }

    for (const task of tasks.value) {
        const [valid, error] = checkValidTask(task);

        if (!valid) {
            alert(error);
            return;
        }
    }

    // we can just cast to ScheduleTask[] since
    // undefined values are accounted for
    emit("save", tasks.value as ScheduleTask[]);
}
</script>

<style scoped>
.task-editor {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    row-gap: 1em;

    max-width: fit-content;
}

.task-editor__control-buttons {
    display: flex;
    column-gap: 1em;
}

.task-editor__tasks {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    row-gap: 1em;
}
</style>
