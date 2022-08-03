<template>
    <div class="tab-item">
        <a
            :href="href"
            v-bind="$attrs"
        >
            <slot></slot>
        </a>
    </div>
</template>

<script setup lang="ts">

interface Props {
    href: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>();

</script>

<style scoped>

a {
    color: #cccccc;
    text-decoration: none;

    font-size: 1.3rem;
}

a:hover {
    color: orange;
    border-bottom: 0.25rem solid orange;
}

</style>