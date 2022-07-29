<template>
    <div class="control-container">
        <RelayInfo :info="relayInfo"></RelayInfo>
        <TextInput
            placeholder="Input Duration (minutes)"
            v-model="inputDuration"
            :disabled="inputDisabled"
        ></TextInput>
        <ToggleSwitch
            v-model="toggleIsOn"
            @change="toggleChange"
        ></ToggleSwitch>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import TextInput from "./TextInput.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import RelayInfo from "./RelayInfo.vue";

import type { IRelayInfo } from "@/app.types";

interface Props {
    relayInfo: IRelayInfo;
}

interface Emits {
    (emit: "change", id: string, activeState: boolean, duration?: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toggleIsOn = ref(props.relayInfo.state.is_active);

watch(
    () => props.relayInfo.state.is_active,
    (newIsActive) => {
        toggleIsOn.value = newIsActive;
    }
);

const inputDuration = ref("");
const inputDisabled = ref(toggleIsOn);

function toggleChange(isOn: boolean) {
    if (isOn) {
        const [valid, error, duration] = parseDuration(inputDuration.value);

        if (!valid) {
            nextTick(() => (toggleIsOn.value = false));
            alert(error);
            console.error(error);
            return;
        }

        // make ts stop erroring
        if (duration === null) {
            return;
        }

        emit("change", props.relayInfo.id, isOn, duration);
    } else {
        emit("change", props.relayInfo.id, isOn, undefined);
    }
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
        return [false, "Duration can't be longer than 10080 (one week)"];
    }

    return [true, null];
}
</script>

<style scoped>
.control-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    column-gap: 3em;
    padding: 1em;

    border: 1px solid orange;
    border-radius: 2px;

    width: 37em;
}
</style>
