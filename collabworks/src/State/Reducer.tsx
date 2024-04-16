import { LOGOUT, SET_PROJECT_ID } from "./ActionTypes";
import { LOGIN_SUCCESS } from "./ActionTypes";
import { HIGHLIGHTED_WORKITEM } from "./ActionTypes";
import { StateModel } from "./StateModel";

const initialState: StateModel = {
  projectUID: "",
  workItemUID: "",
  workItemType: "",
  mail: "",
  uid: "",
  name: "",
  role: "",
  token: "",
  password: "",
  highlightedWorkItemUID: "",
};

const ProjectReducer = (state: StateModel = initialState, action: any) => {
  switch (action.type) {
    case SET_PROJECT_ID:
      return {
        ...state,
        projectUID: action.payload.projectUID,
        workItemUID: action.payload.workItemUID,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        uid: action.payload.uid,
        mail: action.payload.mail,
        name: action.payload.name,
        role: action.payload.role,
        password: action.payload.password,
        token: action.payload.token,
      };
    case HIGHLIGHTED_WORKITEM:
      return {
        ...state,
        highlightedWorkItemUID: action.payload,
      };
    case LOGOUT:
      console.log("Hit")
      return initialState;

    default:
      return state;
  }
};

export default ProjectReducer;
