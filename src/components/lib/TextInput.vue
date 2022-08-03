<template>
    <div class="text-input">
        <input
            type="text"
            class="text-input__input"
            :disabled="disabled"
            v-model="text"
            v-bind="$attrs"
            @input="$emit('update:modelValue', text, $event)"
        />
        <button
            class="clear-button"
            :disabled="disabled"
            v-show="text.length > 0"
            @click="clearText($event)"
        >
            <div class="clear-button__icon"></div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { toREM } from "@/utils/style.js";

interface Props {
    width?: number;
    height?: number;
    borderWidth?: number;

    bgHexColor?: string;
    accentHexColor?: string;
    textHexColor?: string;

    clearButtonSize?: number;
    clearButtonMargin?: number;

    disabled?: boolean;
    modelValue?: string;
}

interface Emits {
    (emit: "update:modelValue", value: string, event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
    width: 180 / 15,
    height: 35 / 15,
    borderWidth: 1 / 15,

    bgHexColor: "#202225",
    accentHexColor: "#dda900",
    textHexColor: "#dcddde",

    clearButtonSize: 10 / 15,
    clearButtonMargin: 1 / 10,

    disabled: false,
    modelValue: "",
});

const emit = defineEmits<Emits>();

const text = ref(props.modelValue);

// parent to child binding
watch(
    () => props.modelValue,
    (newText) => (text.value = newText)
);

function clearText(event: Event) {
    if (props.disabled) {
        return;
    }

    text.value = "";
    emit("update:modelValue", text.value, event);
}
</script>

<style scoped>
.text-input {
    display: inline-flex;
    align-items: center;

    position: relative;
    padding-left: 5px;
    padding-right: 5px;

    width: v-bind("toREM(width)");
    height: v-bind("toREM(height)");

    border: v-bind("toREM(borderWidth)") solid v-bind("accentHexColor");
    border-radius: 2px;

    background-color: v-bind("bgHexColor");
}

/* glow around textbox when user is interacting */
.text-input:focus-within {
    box-shadow: 0 0 3px 0 v-bind("accentHexColor");
}

.text-input__input {
    outline: none;
    border: none;

    padding: 0;

    /* make it fill all free space */
    width: 100%;
    height: 100%;

    background-color: transparent;
    color: v-bind("textHexColor");
}

.text-input__input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.clear-button {
    display: inline-flex;
    border: none;
    appearance: none;

    /* prevent button from shrinking when the textbox expands */
    flex-shrink: 0;

    width: v-bind("toREM(clearButtonSize)");
    height: v-bind("toREM(clearButtonSize)");

    padding: 0;
    margin: v-bind("toREM(clearButtonMargin)");

    background-color: transparent;
    cursor: pointer;
}

.clear-button:disabled {
    cursor: not-allowed;
}

.clear-button__icon {
    display: inline-flex;

    /* center the cross inside the button */
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    opacity: 0.6;
}

.clear-button__icon::before,
.clear-button__icon::after {
    content: "";
    position: absolute;

    width: 1px;
    height: v-bind("toREM(clearButtonSize)");

    background-color: #fff;
}

/* rotate the bar to make a cross */
.clear-button__icon:before {
    transform: rotate(45deg);
}
.clear-button__icon:after {
    transform: rotate(-45deg);
}
</style>
