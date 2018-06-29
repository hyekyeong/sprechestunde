import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware, syncHistoryWithStore } from "react-router-redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import apiMiddleware from "./src/config/middleware.js";
import rootReducer from "./reducers.js";

const configureStore = (history, initialState = {}) => {
    /** Define middlewares **/
    const middlewares = [thunk, apiMiddleware, routerMiddleware(history)];

    /** Create store **/
    const store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middlewares))
    );


    return store;
};

export default configureStore;
