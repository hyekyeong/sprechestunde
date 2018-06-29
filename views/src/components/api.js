import { CALL_API } from "../config/common.js";
import * as Methods from "../config/methods.js";
import * as Actions from "./store/actionTypes";

export const loadUser = id => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id: id },
        endpoint: '//localhost:3002/user',
        types: [
            Actions.LOAD_USER_REQUEST,
            Actions.LOAD_USER_SUCCESS,
            Actions.LOAD_USER_FAILURE
        ]
    }
});

export const loadList = () => ({
    [CALL_API]: {
        method: Methods.GET,
        endpoint: '//localhost:3002/list',
        types: [
            Actions.LOAD_LIST_REQUEST,
            Actions.LOAD_LIST_SUCCESS,
            Actions.LOAD_LIST_FAILURE
        ]
    }
});

export const loadToolId = () => ({
    [CALL_API]: {
        method: Methods.GET,
        endpoint: '//localhost:3002/toolid',
        types: [
            Actions.LOAD_TOOLID_REQUEST,
            Actions.LOAD_TOOLID_SUCCESS,
            Actions.LOAD_TOOLID_FAILURE
        ]
    }
});

export const loadLecturer = id => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id: id },
        endpoint: '//localhost:3002/lecturer',
        types: [
            Actions.LOAD_LECTURER_REQUEST,
            Actions.LOAD_LECTURER_SUCCESS,
            Actions.LOAD_LECTURER_FAILURE
        ]
    }
});

export const getPermission = (Eid, siteId) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { Eid: Eid, siteId: siteId },
        endpoint: '//localhost:3002/getpermission',
        types: [
            Actions.ADD_PERMISSION_REQUEST,
            Actions.ADD_PERMISSION_SUCCESS,
            Actions.ADD_PERMISSION_FAILURE
        ]
    }
});

export const useSignupTool = id => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id: id },
        endpoint: '//localhost:3002/usesignup',
        types: [
            Actions.USE_SIGNUP_REQUEST,
            Actions.USE_SIGNUP_SUCCESS,
            Actions.USE_SIGNUP_FAILURE
        ]
    }
});

export const saveUserType = ( id, type, web_site, location, start_date, end_date, start_time, end_time, day ) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id, type, web_site, location, start_date, end_date, start_time, end_time, day },
        endpoint: '//localhost:3002/inserttype',
        types: [
            Actions.CREATE_CONTACT_REQUEST,
            Actions.CREATE_CONTACT_SUCCESS,
            Actions.CREATE_CONTACT_FAILURE
        ]
    }
});

export const changeUserType = ( id, type, web_site, location, start_date, end_date, start_time, end_time, day ) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id, type, web_site, location, start_date, end_date, start_time, end_time, day },
        endpoint: '//localhost:3002/changetype',
        types: [
            Actions.CHANGE_CONTACT_REQUEST,
            Actions.CHANGE_CONTACT__SUCCESS,
            Actions.CHANGE_CONTACT__FAILURE
        ]
    }
});

export const changeWebsite = ( id, website ) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id, website },
        endpoint: '//localhost:3002/changewebsite',
        types: [
            Actions.CHANGE_WEBSITE_REQUEST,
            Actions.CHANGE_WEBSITE_SUCCESS,
            Actions.CHANGE_WEBSITE_FAILURE
        ]
    }
});

export const changeLocation= ( id, location ) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id, location },
        endpoint: '//localhost:3002/changelocation',
        types: [
            Actions.CHANGE_LOCATION_REQUEST,
            Actions.CHANGE_LOCATION_SUCCESS,
            Actions.CHANGE_LOCATION_FAILURE
        ]
    }
});

export const changeDate = ( id, start_date, end_date, start_time, end_time, day ) => ({
    [CALL_API]: {
        method: Methods.POST,
        body: { id, start_date, end_date, start_time, end_time, day },
        endpoint: '//localhost:3002/changedate',
        types: [
            Actions.CHANGE_DATE_REQUEST,
            Actions.CHANGE_DATE_SUCCESS,
            Actions.CHANGE_DATE_FAILURE
        ]
    }
});