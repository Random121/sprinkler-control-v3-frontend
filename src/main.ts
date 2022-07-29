import { createApp } from "vue";
import { io as SocketIOClient } from "socket.io-client";

import App from "./App.vue";

const SERVER_HOST = `http://${document.getElementById("info")?.dataset.host}:42488`;

const API_VERSION = "v1";
const SOCKETIO_VERSION = "v1";

const RELAYS_API_ENDPOINT = `${SERVER_HOST}/sprinkler/${API_VERSION}/api/relays`;
const SOCKETIO_UPDATE_ENDPOINT = `${SERVER_HOST}/sprinkler/${SOCKETIO_VERSION}/socketio/update`;

const socketioClient = SocketIOClient(SOCKETIO_UPDATE_ENDPOINT, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
});

const app = createApp(App);

app.provide("API_RELAYS_ENDPOINT", RELAYS_API_ENDPOINT);
app.provide("UPDATE_SOCKETIO_CLIENT", socketioClient);

app.mount("#app");
