<template>
    <div class="control-panel">
        <template v-for="relay in relayInformation" :key="relay.id">
            <ControlItem
                :relay-info="relay"
                @change="sendRequest"
            ></ControlItem>
        </template>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import type { Socket } from "socket.io-client";

import ControlItem from "./ControlItem.vue";

import type { RelayInformation } from "@/types/relay.types";

const RELAYS_API_ENDPOINT: string | undefined = inject("RELAYS_API_ENDPOINT");
const UPDATE_SOCKETIO: Socket | undefined = inject("UPDATE_SOCKETIO_CLIENT");

if (!RELAYS_API_ENDPOINT) {
    alert(
        "Failed to load relays API endpoint. The page will refresh in 3 seconds."
    );
    setTimeout(() => window.location.reload(), 3000);
}

const relayInformation: Ref<Array<RelayInformation>> = ref([]);

function updateInformation(information: RelayInformation): void {
    const infoIndex = relayInformation.value.findIndex((oldInfo) => {
        return oldInfo.id === information.id;
    });

    infoIndex !== -1
        // replace old info
        ? (relayInformation.value[infoIndex] = information)
        // add new info
        : relayInformation.value.push(information);
}

if (UPDATE_SOCKETIO) {
    UPDATE_SOCKETIO.on("update", (newInfo: Array<RelayInformation>) => {
        console.log(newInfo);
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
    alert(
        "Failed to load SocketIO client. The page will refresh in 3 seconds."
    );
    setTimeout(() => window.location.reload(), 3000);
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
    const url = `${RELAYS_API_ENDPOINT}/${id}`;
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
.control-panel {
    display: flex;
    align-items: center;
    flex-direction: column;

    row-gap: 1em;
}
</style>
