<template>
    <div class="input-container">
        <input
            type="text"
            class="input-textbox"
            :disabled="disabled"
            :maxlength="maxlength"
            v-model="text"
            v-bind="$attrs"
            @input="$emit('update:modelValue', text, $event)"
        />
        <button
            class="clear-button"
            :disabled="disabled"
            v-show="textLength > 0"
            @click="clearText($event)"
        >
            <div class="clear-icon"></div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface Props {
    width?: number;
    height?: number;

    disabled?: boolean;
    maxlength?: number;

    bgHexColor?: string;
    accentHexColor?: string;
    textHexColor?: string;

    clearButtonSize?: number;
    clearButtonMargin?: number;

    borderWidth?: number;

    modelValue?: string;
}

interface Emits {
    (emit: "update:modelValue", value: string, event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
    width: 180,
    height: 35,

    disabled: false,

    bgHexColor: "#202225",
    accentHexColor: "#dda900",
    textHexColor: "#dcddde",

    clearButtonSize: 10,
    clearButtonMargin: 1,

    borderWidth: 1,

    modelValue: "",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<Emits>();

const text = ref(props.modelValue);
const textLength = computed(() => text.value.length);

// parent to child binding
watch(
    () => props.modelValue,
    (newText) => {
        text.value = newText;
    }
);

function toPixels(value: number): string {
    return `${value}px`;
}

function clearText(event: Event) {
    if (props.disabled) {
        return;
    }

    text.value = "";
    emit("update:modelValue", text.value, event);
}
</script>

<style scoped>
.input-container {
    display: inline-flex;
    align-items: center;

    position: relative;
    padding-left: 5px;
    padding-right: 5px;

    border: v-bind("toPixels(borderWidth)") solid v-bind("accentHexColor");
    border-radius: 2px;

    background-color: v-bind("bgHexColor");

    width: v-bind("toPixels(width)");
    height: v-bind("toPixels(height)");
}

.input-container:focus-within {
    /* glow around textbox when user is interacting */
    box-shadow: 0 0 3px 0 v-bind("accentHexColor");
}

.input-textbox {
    padding: 0;
    outline: none;
    border: none;

    /* make it fill all free space */
    width: 100%;
    height: 100%;

    background-color: transparent;
    color: v-bind("textHexColor");
}

.input-textbox:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.clear-button {
    display: inline-flex;

    /* prevent button from shrinking when the textbox expands */
    flex-shrink: 0;

    width: v-bind("toPixels(clearButtonSize)");
    height: v-bind("toPixels(clearButtonSize)");

    padding: 0;
    margin: v-bind("toPixels(clearButtonMargin)");

    border: none;
    appearance: none;

    background-color: transparent;
    cursor: pointer;
}

.clear-button:disabled {
    cursor: not-allowed;
}

.clear-icon {
    display: inline-flex;

    /* center the cross inside the button */
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    opacity: 0.6;
}

/* create two bars to make the cross */
.clear-icon:before,
.clear-icon:after {
    content: "";
    position: absolute;

    height: v-bind("toPixels(clearButtonSize)");
    width: 1px;

    background-color: #fff;
}

/* rotate the bar to make a cross */
.clear-icon:before {
    transform: rotate(45deg);
}
.clear-icon:after {
    transform: rotate(-45deg);
}
</style>
