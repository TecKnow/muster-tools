import qs from "qs";
import axios from "./axios-config";


export const getServerState = async () => {
    const response = await axios.get("/api");
    return response.data;
}

export const addPlayer = async (playerName) => {
    const response = await axios.post("/api/players", qs.stringify({ name: playerName }));
    return response;
}

export const addTable = async () =>{
    const response = await axios.post("/api/tables");
    return response;
}

export default axios