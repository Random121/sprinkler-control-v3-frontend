<template>
    <div class="day-selector">
        <template
            v-for="(dayName, dayNumber) in DAYS_OF_WEEK"
            :key="dayName"
        >
            <div class="input-group">
                <input
                    type="checkbox"
                    :id="dayName"
                    :value="dayNumber"
                    v-model="selectedDays"
                />
                <label :for="dayName">{{ dayName }}</label>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

interface Props {
    modelValue?: number[];
}

interface Emits {
    (emit: "update:modelValue", selectedDays: number[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedDays = ref(props.modelValue || []);

watch(
    () => props.modelValue,
    (newSelectedDays) => (selectedDays.value = newSelectedDays || [])
);

watch(
    selectedDays,
    (newSelectedDays) => emit("update:modelValue", newSelectedDays)
);
</script>

<style scoped>
.day-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row wrap;

    column-gap: 1.25em;
}

/* dont wrap the button and label group */
.input-group {
    flex-wrap: nowrap;
}

.input-group > label {
    color: white;
}

@media (max-width: 45em) {
    .day-selector {
        flex-flow: column wrap;
        align-items: flex-start;
    }
}

</style>
