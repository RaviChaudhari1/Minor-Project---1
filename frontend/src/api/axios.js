import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // backend base
  withCredentials: true, // allow cookies (if you later use refresh tokens)
});

export default instance;
