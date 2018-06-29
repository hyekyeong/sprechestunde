import { combineReducers } from "redux";
import reducer from './src/components/store/reducers.js';
import loading from './src/config/loading.js';

const rootReducer = combineReducers({
    loading,
    reducer: reducer
});

export default rootReducer;