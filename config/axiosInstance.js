const axios = require("axios");
const apiKey = process.env.API_KEY;

const axiosInstance = axios.create({
    baseURL: process.env.MOVIES_DB_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptor with the API key req param to all requests
axiosInstance.interceptors.request.use(config => {
    config.params = {
        api_key: apiKey,
    }
    return config;
}, error => Promise.reject(error));


module.exports = {axiosInstance}
