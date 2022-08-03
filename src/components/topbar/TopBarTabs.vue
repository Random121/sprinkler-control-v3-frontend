<template>
    <nav class="tabs">
        <slot></slot>
    </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.tabs {
    display: flex;
    align-self: flex-end;
    justify-content: space-evenly;

    column-gap: 2rem;

    margin: 0;

    padding-right: 3rem;
    padding-bottom: 0.5rem;
}
</style>
