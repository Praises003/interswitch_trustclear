import axios from "axios";

const api = axios.create({
  baseURL: "https://interswitch-trustclear-backend.onrender.com/api/v1", // your backend
});

export default api;