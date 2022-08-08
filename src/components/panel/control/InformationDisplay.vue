<template>
    <div class="info-display">
        <span class="info-display__name">{{ relayInfo.name }}</span>
        <div class="relay-info">
            <!-- time information -->
            <div class="relay-info__group">
                <span>Duration: {{ durationFormatted }}</span>
                <span>Remaining: {{ remainingTimeFormatted }}</span>
            </div>
            <!-- relay information -->
            <div class="relay-info__group">
                <span>Pin: {{ relayInfo.pin }}</span>
                <span>ID: {{ relayInfo.id }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { computed, ref, watch, watchEffect } from "vue";

import { DurationTimer } from "@/utils/DurationTimer.js";
import type { RelayInformation } from "@/types/relay.types";

dayjs.extend(duration);

interface Props {
    relayInfo: RelayInformation;
}

const props = defineProps<Props>();

const durationFormatted = computed(() =>
    formatTime(props.relayInfo.state.duration)
);

const remainingTime = ref(props.relayInfo.state.time_remaining);
const remainingTimeFormatted = computed(() => formatTime(remainingTime.value));

const durationTimer = new DurationTimer(remainingTime.value ?? 0);

durationTimer.setTickCallback((duration, remaining) => {
    remainingTime.value = remaining;
});

watch(
    () => props.relayInfo.state.time_remaining,
    (newRemaining) => {
        const remaining = Math.ceil(newRemaining ?? 0);
        remainingTime.value = remaining;
        durationTimer.setDuration(remaining);
    }
);

watchEffect(() => {
    props.relayInfo.state.is_active
        ? durationTimer.start()
        : durationTimer.end();
});

function formatTime(seconds: number | null): string {
    const milliseconds = (seconds ?? 0) * 1000;
    return dayjs.duration(milliseconds).format("HH:mm:ss");
}
</script>

<style scoped>
.info-display {
    display: inline-flex;
    align-items: center;
    flex-direction: column;

    row-gap: 0.25em;
}

.info-display__name {
    color: white;
    font-size: 1.75em;
}

.relay-info {
    display: inline-flex;
    justify-content: space-between;

    column-gap: 1em;
}

.relay-info__group span {
    color: #b9bbbe;
    font-size: 1em;
}

.relay-info__group {
    display: inline-flex;
    justify-content: space-between;
    flex-direction: column;
}
</style>
