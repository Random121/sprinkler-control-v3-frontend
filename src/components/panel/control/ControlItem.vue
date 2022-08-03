<template>
    <div class="control">
        <InformationDisplay :relay-info="relayInfo"></InformationDisplay>
        <TextInput
            placeholder="Input Duration (minutes)"
            v-model="inputDuration"
            :disabled="inputDisabled"
        ></TextInput>
        <ToggleButton
            v-model="toggleIsOn"
            @change="toggleChange"
        ></ToggleButton>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import InformationDisplay from "./InformationDisplay.vue";
import ToggleButton from "@/components/lib/ToggleButton.vue";
import TextInput from "@/components/lib/TextInput.vue";

import type { RelayInformation } from "@/types/relay.types";

interface Props {
    relayInfo: RelayInformation;
}

interface Emits {
    (emit: "change", id: string, isActive: boolean, duration?: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toggleIsOn = ref(props.relayInfo.state.is_active);

watch(
    () => props.relayInfo.state.is_active,
    (newIsActive) => (toggleIsOn.value = newIsActive)
);

const inputDuration = ref("");
const inputDisabled = ref(toggleIsOn);

function toggleChange(isOn: boolean): void {
    let duration: number | undefined = undefined;

    if (isOn) {
        const [valid, error, parsedDuration] = parseDuration(
            inputDuration.value
        );

        if (!valid) {
            nextTick(() => (toggleIsOn.value = false));
            alert(error);
            console.error(error);
            return;
        }

        duration = parsedDuration ?? undefined;
    }

    emit("change", props.relayInfo.id, isOn, duration);
}

function parseDuration(
    inputDuration: string
): [boolean, string | null, number | null] {
    const durationValue = inputDuration.trim();
    const [valid, error] = isDurationValid(durationValue);

    if (!valid) {
        return [false, error, null];
    }

    const durationMinutes = Number(durationValue);
    const durationSeconds = durationMinutes * 60;
    const relayDuration = roundPrecision(durationSeconds);

    return [true, null, relayDuration];
}

// prevent sending long numbers to API
function roundPrecision(seconds: number): number {
    return Number(seconds.toFixed(2));
}

// returns whether or not the duration (IN MINUTES) is valid
// and a corresponding error message
function isDurationValid(duration: string): [boolean, string | null] {
    const durationNumber = Number(duration);

    if (duration.length === 0 || Number.isNaN(durationNumber)) {
        return [false, "Duration must be a number"];
    }

    if (durationNumber <= 0) {
        return [false, "Duration must be greater than 0"];
    }

    if (durationNumber > 10080) {
        return [
            false,
            "Duration can't be longer than 10080 minutes (one week)",
        ];
    }

    return [true, null];
}
</script>

<style scoped>
.control {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    flex-flow: row wrap;

    column-gap: 3em;
    row-gap: 1em;

    padding: 1em;

    border: 1px solid orange;
    border-radius: 2px;

    max-width: 40em;
}

@media (min-width: 37em) {
    .control {
        width: 100%;
    }
}
</style>
