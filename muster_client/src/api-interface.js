import qs from "qs";
import axios from "./axios-config";

export const getServerState = async () => {
  const response = await axios.get("/api");
  return response.data;
};

export const addPlayer = async (playerName) => {
  const response = await axios.post(
    "/api/players",
    qs.stringify({ name: playerName })
  );
  return response;
};

export const addTable = async () => {
  const response = await axios.post("/api/tables");
  return response;
};

export const assignSeat = async (playerName, table, position) => {
  const response = await axios.post(
    "/api/seats/assign",
    qs.stringify({ playerName, table, position })
  );
  return response;
};

export const resetSeats = async () => {
  const response = await axios.post("/api/seats/reset");
  return response;
};

export const shuffleZero = async () => {
  const response = await axios.post("/api/seats/shuffle");
  return response;
};

export default axios;
