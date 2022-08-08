<template>
    <div class="tab-item">
        <RouterLink
            :to="to"
            v-bind="$attrs"
        >
            <slot></slot>
        </RouterLink>
    </div>
</template>

<script setup lang="ts">

interface Props {
    to: string | object;
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
}

.router-link-active {
    color: orange;
    border-bottom: 0.25rem solid orange;
}

</style>