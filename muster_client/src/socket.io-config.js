import { io } from "socket.io-client";
export const socket = io();

export default socket;

socket.on("connect_error", () => {
  console.log("Connection error");
});

socket.on("connect", () => {
  console.log("Web socket connected");
});

console.log("Registering handler for all events");
socket.onAny((event) => {
  console.log(`Event: ${JSON.stringify(event)}`);
});
