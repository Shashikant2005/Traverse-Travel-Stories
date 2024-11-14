import axios from "axios"
import { BASE_URL } from "./constants"

const axiosInstance = axios.create({

    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        // Add logic to modify the request before it is sent, such as adding an authorization token
      //  console.log("Request made with config:", config);
        
        // Example: Add an authorization header if needed
        const accesstoken = localStorage.getItem("token");
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
        }       
        return config;
    },
    (error) => {
        // Handle the error if the request cannot be sent
        return Promise.reject(error);
    }
);

export default axiosInstance;