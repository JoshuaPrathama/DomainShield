import axios, { AxiosInstance } from "axios";

export default class AxiosHelper {
    private axios: AxiosInstance;

    constructor() {
        console.log("API URL = ",import.meta.env.VITE_API_URL);
        this.axios = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            validateStatus: (status) => status >= 200 && status < 300,
        });
    }

    getAxios() {
        this.axios.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error),
        );

        this.axios.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(error),
        );

        return this.axios;
    }
}
