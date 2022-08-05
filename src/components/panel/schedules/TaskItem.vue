<template>
    <div class="task">
        <TextInput
            class="task__relay-id"
            placeholder="Relay ID"
            v-model="info.id"
        ></TextInput>
        <TextInput
            class="task__start-time"
            placeholder="Start Time (HH:mm:ss)"
            v-model="info.start"
        ></TextInput>
        <TextInput
            class="task__duration"
            placeholder="Duration (minutes)"
            v-model.number="info.duration"
        ></TextInput>
        <button @click="$emit('delete')">Delete</button>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/components/lib/TextInput.vue";
import type { ScheduleTask } from "@/types/schedule.types.js";
import { ref, watch } from "vue";

interface Props {
    taskInfo: ScheduleTask;
}

interface Emits {
    (emit: "delete"): void;
    (emit: "change", taskInfo: ScheduleTask): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const info = ref(props.taskInfo);

// parent to child binding
watch(
    () => props.taskInfo,
    (newTaskInfo) => {
        info.value = newTaskInfo;
    }
);

// send updates whenever the user inputs
watch(info, (newInfo: ScheduleTask) => emit("change", newInfo), { deep: true });
</script>

<style scoped>
.task {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;

    padding: 1em;

    row-gap: 0.5em;
    column-gap: 1em;

    border: 1px solid lightblue;
    border-radius: 2px;
}
</style>
