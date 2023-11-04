const _ = require("lodash");
const axios = require("axios");
const {systemLogger} = require("../src/utils/logger");
const apiKey = process.env.API_KEY;
const moviesDbApi = process.env.MOVIES_DB_API || "https://api.themoviedb.org/3"


const axiosInstance = axios.create({
    baseURL: moviesDbApi,
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptor with the API key req param to all requests
axiosInstance.interceptors.request.use(config => {
    if (_.isEmpty(apiKey)) {
        systemLogger.error(`Missing environment variable 'API_KEY', Cannot fetch movies API`);
        console.log(`Missing environment variable 'API_KEY', Cannot fetch movies API`)
        process.exit(1)
    }
    config.params = {
        api_key: apiKey,
    }
    return config;
}, error => Promise.reject(error));


module.exports = {axiosInstance}
