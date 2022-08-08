<template>
    <div class="top-bar">
        <h1 class="top-bar-title">
            <RouterLink :to="{ name: 'control' }">Sprinkler Control</RouterLink>
        </h1>
        <TopBarTabs>
            <TabItem :to="{ name: 'control' }">Control</TabItem>
            <TabItem :to="{ name: 'schedule' }">Schedules</TabItem>
        </TopBarTabs>
    </div>
</template>

<script setup lang="ts">
import TabItem from "./TabItem.vue";
import TopBarTabs from "./TopBarTabs.vue";

</script>

<style scoped>
.top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    width: 100%;

    margin: 0;
    margin-bottom: 1rem;

    background-color: #161616;
}

.top-bar-title {
    color: white;
    font-size: 1.5rem;

    margin: 0.75rem;

    cursor: pointer;
}

a {
    all: unset;
}

</style>
