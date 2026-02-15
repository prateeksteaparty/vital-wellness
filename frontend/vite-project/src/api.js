import axios from "axios";

const API = axios.create({
  baseURL: "https://vital-backend-q28o.onrender.com/api",
  withCredentials: true
});

export default API;
