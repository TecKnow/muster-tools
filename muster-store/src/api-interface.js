import qs from "qs";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export const selectAllPlayers = async () => {
  const response = await axios.get("/api/players");
  return response.data;
};

export const addPlayer = async (playerName) => {
  const response = await axios.post(
    "/api/players",
    qs.stringify({ name: playerName })
  );
  return response;
};

export const deletePlayer = async (playerName) => {
  const response = await axios.delete(`/api/players/${playerName}`);
  return response;
};

export const selectAllTables = async () => {
  const response = await axios.get("/api/tables");
  return response.data;
};

export const addTable = async () => {
  const response = await axios.post("/api/tables");
  return response;
};

export const deleteTable = async (tableIdentifier) => {
  const response = await axios.delete(`api/tables/${tableIdentifier}`);
  return response;
};

export const selectAllSeats = async () => {
  const response = await axios.get("/api/seats");
  return response.data;
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
  return response.data;
};

export const shuffleZero = async () => {
  const response = await axios.post("/api/seats/shuffle");
  return response.data;
};

export const resetSystem = async () => {
  const response = await axios.post("api/systemReset");
  return response;
};

export default axios;
