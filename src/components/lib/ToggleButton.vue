<template>
    <label class="toggle">
        <input
            type="checkbox"
            class="toggle__checkbox"
            :disabled="disabled"
            v-model="isOn"
            v-bind="$attrs"
            @change="sendUpdates($event)"
        />
        <span class="toggle__slider"></span>
    </label>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toREM } from "@/utils/style";

interface Props {
    width?: number;
    height?: number;
    handleMargin?: number;

    onHexColor?: string;
    offHexColor?: string;

    toggleSpeed?: number;

    borderWidth?: number;
    borderHexColor?: string;

    disabled?: boolean;
    modelValue?: boolean;
}

interface Emits {
    (emit: "change", isOn: boolean, event: Event): void;
    (emit: "update:modelValue", isOn: boolean, event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
    width: 50 / 14,
    height: 25 / 14,
    handleMargin: 2 / 14,

    onHexColor: "#558b2f",
    offHexColor: "#df362d",

    toggleSpeed: 0.15,

    borderWidth: 0,
    borderHexColor: "#d3d3d3",

    disabled: false,
    modelValue: false,
});

const emit = defineEmits<Emits>();

const isOn = ref(props.modelValue);

// parent to child binding
watch(
    () => props.modelValue,
    (newIsOn) => (isOn.value = newIsOn)
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
// styling
//

// width and height of slider excluding the border
const contentWidth = computed(() => props.width - 2 * props.borderWidth);
const contentheight = computed(() => props.height - 2 * props.borderWidth);

const handleDiameter = computed(() =>
    toREM(contentheight.value - 2 * props.handleMargin)
);

const handleTravelDistance = computed(() =>
    toREM(contentWidth.value - contentheight.value)
);
</script>

<style scoped>
.toggle {
    display: inline-block;
    position: relative;

    opacity: v-bind("disabled ? 0.6 : 1");

    cursor: v-bind("disabled ? 'not-allowed' : 'pointer'");
    user-select: none;

    width: v-bind("toREM(width)");
    height: v-bind("toREM(height)");
}

/* hide checkbox since we only need its toggle feature */
.toggle__checkbox {
    display: none;
}

.toggle__slider {
    display: block;
    position: relative;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    /* Make the toggle a rounded rectangle */
    border-radius: v-bind("toREM(height / 2)");

    /* add custom border around the toggle */
    border: v-bind("toREM(borderWidth)") solid v-bind("borderHexColor");

    background-color: v-bind("offHexColor");

    transition: background-color v-bind("`${toggleSpeed}s`");
}

/* change color when activated */
.toggle__checkbox:checked + .toggle__slider {
    background-color: v-bind("onHexColor");
}

/* create the handle (moving circle) */
.toggle__slider::before {
    content: "";
    position: absolute;

    width: v-bind("handleDiameter");
    height: v-bind("handleDiameter");

    border-radius: 100%;
    background-color: white;

    margin: v-bind("toREM(handleMargin)");

    transition: transform v-bind("`${toggleSpeed}s`");
}

/* move handle when activated */
.toggle__checkbox:checked + .toggle__slider::before {
    transform: translateX(v-bind("handleTravelDistance"));
}

</style>
