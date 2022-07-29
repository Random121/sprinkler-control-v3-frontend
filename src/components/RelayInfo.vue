<template>
    <div class="info-container">
        <span class="name-info">{{ info.name }}</span>
        <div class="additional-info">
            <!-- time information -->
            <div class="info-group">
                <span>Duration: {{ durationFormatted }}</span>
                <span>Remaining: {{ remainingFormatted }}</span>
            </div>
            <!-- relay information -->
            <div class="info-group">
                <span>Pin: {{ info.pin }}</span>
                <span>ID: {{ info.id }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { computed, ref, watch, watchEffect } from "vue";

import type { IRelayInfo } from "@/app.types";
import { DurationTimer } from "@/DurationTimer";

dayjs.extend(duration);

interface Props {
    info: IRelayInfo;
}

const props = defineProps<Props>();

const durationFormatted = computed(() => formatTime(props.info.state.duration));

const remainingTime = ref(props.info.state.time_remaining);
const remainingFormatted = computed(() => formatTime(remainingTime.value));

const durationTimer = new DurationTimer(remainingTime.value ?? 0);

durationTimer.setTickCallback((duration, remaining) => {
    remainingTime.value = remaining;
});

watch(
    () => props.info.state.time_remaining,
    (newRemaining) => {
        const remaining = Math.ceil(newRemaining ?? 0);
        remainingTime.value =remaining;
        durationTimer.setDuration(remaining);
    }
);

watchEffect(() => {
    props.info.state.is_active
        ? durationTimer.start()
        : durationTimer.end();
});

function formatTime(seconds: number | null): string {
    const milliseconds = (seconds ?? 0) * 1000;
    return dayjs.duration(milliseconds).format("HH:mm:ss");
}
</script>

<style scoped>
.info-container {
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    row-gap: 0.25em;
}

.name-info {
    color: white;
    font-size: 1.75em;
}

.additional-info {
    display: inline-flex;
    justify-content: space-between;

    column-gap: 1em;
}

.info-group span {
    color: #b9bbbe;
    font-size: 0.9em;
}

.info-group {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
