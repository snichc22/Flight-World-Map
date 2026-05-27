import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:4000/api",
    timeout: 15000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API error:", error?.response?.data ?? error.message);
        return Promise.reject(error);
    }
);