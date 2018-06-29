import * as Action from './actionTypes.js';

const initialState = {
    userEid: null,
    isLecturer: null,
    list: [],
    signup: [],
    hasType: null,
    toolId: [],
    typeData: [],
    signupUrl: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Action.LOAD_USER_SUCCESS: {
            return { ...state, isLecturer: action.data.isLecturer, userEid: action.data.Eid };
        }
        case Action.LOAD_LIST_SUCCESS: {
            return { ...state, list: action.data.list, signup: action.data.signup };
        }
        case Action.LOAD_LECTURER_SUCCESS: {
            return { ...state, hasType: action.data.hasType, typeData: action.data.typeData, signupUrl: action.data.signupUrl };
        }
        case Action.USE_SIGNUP_SUCCESS: {
            return { ...state, signupUrl: action.data.signupUrl };
        }
        case Action.LOAD_TOOLID_SUCCESS: {
            return { ...state, toolId: action.data.toolId }
        }
        default: {
            return state;
        }
    }
};

export default reducer;