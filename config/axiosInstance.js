const _ = require("lodash");
const axios = require("axios");
const apiKey = process.env.API_KEY;
const {systemLogger} = require("../utils/logger");

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


// interceptor for handling 429 rate limit - sleep for a random time between 0.5 to 1 second
// TODO - handle retry if 429 rate limit
// axiosInstance.interceptors.response.use(
//     response => response,
//     async error => {
//         if (_.get(error, 'response.status') === 429) {
//             systemLogger.warn('Rate limit exceeded. Retrying after a random delay');
//
//             const randomDelay = _.random(500, 1000);
//
//             await _.delay(() => {
//             }, randomDelay);
//
//             return axiosInstance.request(error.config);
//         }
//         return Promise.reject(error);
//     }
// );


module.exports = {axiosInstance}
