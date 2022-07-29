<template>
    <label class="toggle-container">
        <input
            type="checkbox"
            class="toggle-checkbox"
            :disabled="disabled"
            v-model="isOn"
            v-bind="$attrs"
            @change="sendUpdates($event)"
        />
        <span class="toggle-slider"></span>
    </label>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface Props {
    width?: number;
    height?: number;
    handleMargin?: number;

    onHexColor?: string;
    offHexColor?: string;

    toggleSpeed?: number;
    disabled?: boolean;

    borderWidth?: number;
    borderHexColor?: string;

    modelValue?: boolean;
}

interface Emits {
    (emit: "change", isOn: boolean, event: Event): void;
    (emit: "update:modelValue", isOn: boolean, event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
    width: 50,
    height: 25,
    handleMargin: 2,

    onHexColor: "#558b2f",
    offHexColor: "#df362d",

    toggleSpeed: 0.15,
    disabled: false,

    borderWidth: 0,
    borderHexColor: "#d3d3d3",

    modelValue: false,
});

const emit = defineEmits<Emits>();

//
// Logic values
//

const isOn = ref(props.modelValue);

// parent to child binding
watch(
    () => props.modelValue,
    (newIsOn) => {
        isOn.value = newIsOn;
    }
);

function sendUpdates(event: Event) {
    const isOnValue = isOn.value;

    // NOTE: v-model emit comes before @change
    // so it maintains the default behaviour
    // https://github.com/vuejs/vue/issues/6709
    emit("update:modelValue", isOnValue, event);
    emit("change", isOnValue, event);
}

//
// styling values
//

function toPixels(value: number): string {
    return `${value}px`;
}

// width and height of the slider excluding the border
const contentWidth = computed(() => props.width - 2 * props.borderWidth);
const contentHeight = computed(() => props.height - 2 * props.borderWidth);

const handleDiameter = computed(() => {
    return toPixels(contentHeight.value - 2 * props.handleMargin);
});

const handleTravelDistance = computed(() => {
    return toPixels(contentWidth.value - contentHeight.value);
});
</script>

<style scoped>
.toggle-container {
    display: inline-block;
    position: relative;

    opacity: v-bind("disabled ? 0.6 : 1");

    cursor: v-bind("disabled ? 'not-allowed' : 'pointer'");
    user-select: none;

    width: v-bind("toPixels(width)");
    height: v-bind("toPixels(height)");
}

.toggle-checkbox {
    display: none;
}

.toggle-slider {
    display: block;
    position: relative;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    /* Make the toggle a rounded rectangle */
    border-radius: v-bind("toPixels(height / 2)");

    /* allow a custom border around the toggle */
    border: v-bind("toPixels(borderWidth)") solid v-bind("borderHexColor");

    background-color: v-bind("offHexColor");

    transition: background-color v-bind("`${toggleSpeed}s`");
}

/* change color when activated */
.toggle-checkbox:checked + .toggle-slider {
    background-color: v-bind("onHexColor");
}

/* create the handle (moving circle) */
.toggle-slider::before {
    content: "";
    position: absolute;

    width: v-bind("handleDiameter");
    height: v-bind("handleDiameter");

    border-radius: 100%;
    background-color: white;

    margin: v-bind("toPixels(handleMargin)");

    transition: transform v-bind("`${toggleSpeed}s`");
}

/* move handle when activated */
.toggle-checkbox:checked + .toggle-slider::before {
    transform: translateX(v-bind("handleTravelDistance"));
}
</style>
