import { createApp } from "vue";
import { io as SocketIOClient } from "socket.io-client";

import { router } from "./router";
import App from "./App.vue";

const SERVER_HOST = `http://192.168.0.27:42488`;
// const SERVER_HOST = `http://${document.getElementById("info")?.dataset.host}:42488`;

const API_VERSION = "v1";
const SOCKETIO_VERSION = "v1";

const SCHEDULES_API_ENDPOINT = `${SERVER_HOST}/sprinkler/${API_VERSION}/api/schedules`;
const RELAYS_API_ENDPOINT = `${SERVER_HOST}/sprinkler/${API_VERSION}/api/relays`;
const UPDATE_SOCKETIO_ENDPOINT = `${SERVER_HOST}/sprinkler/${SOCKETIO_VERSION}/socketio/update`;

const socketioClient = SocketIOClient(UPDATE_SOCKETIO_ENDPOINT, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
});

const app = createApp(App);

app.provide("RELAYS_API_ENDPOINT", RELAYS_API_ENDPOINT);
app.provide("SCHEDULES_API_ENDPOINT", SCHEDULES_API_ENDPOINT);
app.provide("UPDATE_SOCKETIO_CLIENT", socketioClient);

app.use(router);
app.mount("#app");
