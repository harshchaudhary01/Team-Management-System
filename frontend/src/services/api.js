import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: backendUrl,
});

export default API;