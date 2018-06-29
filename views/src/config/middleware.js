/** API Middleware **/
import fetch from "isomorphic-fetch";
import { CALL_API } from "../config/common.js";

const API_ROOT = "//localhost:3002";

/** Set the default request headers **/
const setHeaders = config => {
    config.headers = {
        "Content-Type": "application/json"
    };

    return config;
};

/** Execute request **/
const apiCall = async (method, endpoint, body = null) => {
    const config = setHeaders({ method });

    if (body !== null) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);
    const json = await response.json();

    return response.ok ? json : Promise.reject(json);
};

/** Middleware function **/
const apiMiddleware = store => next => async action => {
    if (!Object.prototype.hasOwnProperty.call(action, CALL_API)) { 
        return next(action);
    }

    const callAPI = action[CALL_API];

    const { method, endpoint, types, body } = callAPI;
    const [requestType, successType, errorType] = types;

    next({
        type: requestType
    });

    console.log(endpoint);

    return apiCall(method, endpoint, body).then(
        data =>
            next({
                type: successType,
                data
            }),

        data => {
            return next({
                type: errorType,
                error: data.error || data
            });
        }
    );
};

export default apiMiddleware;
