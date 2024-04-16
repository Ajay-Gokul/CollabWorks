import { createStore, combineReducers } from "redux";
import ProjectReducer from "./Reducer";

const store = createStore(ProjectReducer);
export default store;
