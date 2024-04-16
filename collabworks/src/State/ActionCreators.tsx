import { log } from "console";
import { HIGHLIGHTED_WORKITEM, LOGOUT, SET_PROJECT_ID } from "./ActionTypes";
import { LOGIN_SUCCESS } from "./ActionTypes";
import { StateModel } from "./StateModel";

export const setProjectUID = (projectUID: StateModel) => ({
  type: SET_PROJECT_ID,
  payload: projectUID,
});

export const setLoggedInUserDetails = (userDeatils: StateModel) => ({
  type: LOGIN_SUCCESS,
  payload: userDeatils,
});

export const setHighlightedWorkItemUID = (highlightedWorkItemUID: string) => ({
  type: HIGHLIGHTED_WORKITEM,
  payload: highlightedWorkItemUID,
});

export const setLogOut = () => ({
  type: LOGOUT,
});
