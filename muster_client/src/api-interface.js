import axios from "./axios-config";
import qs from "qs";


export const getServerState = async () => {
    const response = await axios.get("/api");
    return response.data;
}

export const addPlayer = async (playerName) => {
    try {
        const response = await axios.post("/api/players", qs.stringify({ name: playerName }));
        return response;
    }
    catch (error) {
        throw (error)
    }
}

export default axios