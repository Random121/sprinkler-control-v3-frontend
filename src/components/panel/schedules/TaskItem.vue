<template>
    <div class="task">
        <TextInput
            class="task__relay-id"
            placeholder="Relay ID"
            v-model="relayId"
            @change="sendUpdate"
        ></TextInput>
        <TextInput
            class="task__start-time"
            placeholder="Start Time (HH:mm:ss)"
            v-model="startTime"
            @change="sendUpdate"
        ></TextInput>
        <TextInput
            class="task__duration"
            placeholder="Duration (minutes)"
            v-model.number="duration"
            @change="sendUpdate"
        ></TextInput>
        <button @click="$emit('delete')">Delete</button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

import TextInput from "@/components/lib/TextInput.vue";
import type { EditableScheduleTask } from "@/types/schedule.types";

interface Props {
    taskInfo: EditableScheduleTask;
}

interface Emits {
    (emit: "delete"): void;
    (emit: "change", taskInfo: EditableScheduleTask): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const relayId = ref(props.taskInfo.id);
const startTime = ref(props.taskInfo.start);

const internalDuration = ref(props.taskInfo.duration);
const duration = computed<number | undefined>({
    get() {
        return internalDuration.value !== undefined
            ? internalDuration.value / 60
            : internalDuration.value;
    },
    set(newDuration) {
        internalDuration.value =
            newDuration !== undefined ? newDuration * 60 : newDuration;
    },
});

const taskInfo = computed<EditableScheduleTask>(() => {
    return {
        id: relayId.value,
        start: startTime.value,
        duration: internalDuration.value,
    };
});

// parent to child binding
watch(
    () => props.taskInfo,
    (newTaskInfo) => {
        relayId.value = newTaskInfo.id;
        startTime.value = newTaskInfo.start;
        internalDuration.value = newTaskInfo.duration;
    }
);

// send updates whenever the user inputs
function sendUpdate() {
    emit("change", taskInfo.value);
}
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
