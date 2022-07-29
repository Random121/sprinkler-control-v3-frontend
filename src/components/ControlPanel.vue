<template>
    <fieldset class="panel-container">
        <legend class="panel-name">Control Panel</legend>
        <template v-for="relay in relayInformation" v-bind:key="relay.id">
            <ControlBlock
                :relay-info="relay"
                @change="sendRequest"
            ></ControlBlock>
        </template>
    </fieldset>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from "vue";
import type { Socket } from "socket.io-client";

import ControlBlock from "./ControlBlock.vue";
import type { IRelayInfo } from "@/app.types";

const API_RELAYS_ENDPOINT: string | undefined = inject("API_RELAYS_ENDPOINT");
const UPDATE_SOCKETIO: Socket | undefined = inject("UPDATE_SOCKETIO_CLIENT");

const relayInformation: Ref<Array<IRelayInfo>> = ref([]);

if (!API_RELAYS_ENDPOINT) {
    alert("Failed to load relays API endpoint. Please refresh the page.");
}

function updateInformation(newInfo: IRelayInfo) {
    const infoIndex = relayInformation.value.findIndex((oldInfo) => {
        return oldInfo.id === newInfo.id;
    });

    if (infoIndex !== -1) {
        // replace old info
        relayInformation.value[infoIndex] = newInfo;
    } else {
        // new ID before so add it to info
        relayInformation.value.push(newInfo);
    }
}

if (UPDATE_SOCKETIO) {
    UPDATE_SOCKETIO.on("update", (newInfo: Array<IRelayInfo>) => {
        for (const info of newInfo) {
            updateInformation(info);
        }
    });

    UPDATE_SOCKETIO.on("disconnect", (msg) => {
        console.error(`[SOCKETIO] Disconnect: ${msg}`);
        alert("Trying to reconnect to server. Please wait.");
    });

    UPDATE_SOCKETIO.io.on("reconnect_failed", () => {
        UPDATE_SOCKETIO.disconnect();
        alert("Could not reconnect to server. Please refresh the page.");
    });
} else {
    alert("Failed to load socketio client. Please refresh the page.");
}

async function postData(url: string, data: object) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response.json();
}

function sendRequest(id: string, activeState: boolean, duration?: number) {
    const url = `${API_RELAYS_ENDPOINT}/${id}`;
    const data = {
        action: activeState ? "enable" : "disable",
        arguments: {
            duration: duration,
        },
    };

    postData(url, data)
        .catch((err) => console.error(err));
}
</script>

<style scoped>
.panel-container {
    display: inline-flex;
    flex-direction: column;

    row-gap: 1em;

    padding: 2em 4em 2em 4em;

    width: auto;
    margin-top: 1em;
    margin-left: 25%;
    margin-right: 25%;
}

.panel-name {
    /* center in fieldset */
    margin-left: auto;
    margin-right: auto;

    color: white;
    font-size: 1.5em;
}
</style>
