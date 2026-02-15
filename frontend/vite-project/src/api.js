import axios from "axios";

const API = axios.create({
  baseURL: "https://vital-wellness.onrender.com/api",
  withCredentials: true
});

export default API;
