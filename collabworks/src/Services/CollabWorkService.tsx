import axios from "axios";
import Constants from "../Utilities/Constants";
import { HomePageImage } from "../Model/HomePageImage";
import { RegisterUser } from "../Model/Register";
import { Login } from "../Model/Login";
import { WorkItem } from "../Model/WorkItem";
import { UpdateWorkItem } from "../Model/UpdateWorkItem";
import { WorkItemList } from "../Model/FormProperties";
import { parentWorkItem } from "../Model/ParentWorkItem";
import { Sprint } from "../Model/Sprint";
import { log } from "console";
const token = localStorage.getItem("Token");
const headers = {
  accept: "text/plain",
  Authorization: `Bearer ${token}`,
};

class CollabWorkSerive {
  http = axios.create({
    baseURL: Constants.BaseURL,
  });

  async GetAllHomePageImages() {
    let response = await this.http.get(Constants.GetHomePageImages);
    return response;
  }

  async GetFormProperties(projectUID: string) {
    console.log("CS projectUID", projectUID);
    let response = await this.http.get(
      `${Constants.GetFormProperties}${projectUID}`
    );
    return response;
  }

  async RegisterUser(user: RegisterUser) {
    let response = await this.http.post(Constants.Register, user);
    return response;
  }

  async Login(user: Login) {
    let response = await this.http.post(Constants.Login, user);
    return response;
  }

  async GetAllProjets() {
    let response = await this.http.get(Constants.GetAllProjects);
    return response;
  }

  async GetProjetNames(projectUID: string) {
    let response = await this.http.get(Constants.FetchProjectName + projectUID);
    return response;
  }

  async FetchAllWorkItems(projectUID: string) {
    let response = await this.http.get(Constants.FetchWorkItems + projectUID);
    return response;
  }

  async UpdateWorkItems(updateWorkItem: UpdateWorkItem | undefined) {
    let response = await this.http.put(
      Constants.UpdateWorkItem,
      updateWorkItem
    );
    return response;
  }

  async AddWorkItem(addWorkItem: WorkItem) {
    let response = await this.http.post(Constants.AddWorkItem, addWorkItem);
    return response;
  }

  async GetParentWorkItems(workItemList: parentWorkItem) {
    let response = await this.http.post(
      Constants.GetAllParentWorkItems,
      workItemList
    );
    return response;
  }

  async AddSprint(sprintDetails: Sprint) {
    let response = await this.http.post(Constants.AddSprint, sprintDetails, {
      headers,
    });
    return response;
  }

  async GetWorkItemByUID(workItemUID: string | undefined) {
    let response = await this.http.get(
      Constants.GetWorkItemByUID + workItemUID
    );
    return response;
  }

  async GetWorkItemBySprintUID(sprintUID: string) {
    let response = await this.http.get(
      Constants.GetWorkItemBySprintUID + sprintUID
    );
    return response;
  }

  async GetSprintByProjectUID(projectUID: string) {
    let response = await this.http.get(
      Constants.GetSprintByProjectUID + projectUID
    );
    return response;
  }

  async GetRelatedWorkItemsByUID(workItemUID: string) {
    let response = await this.http.get(
      Constants.GetRelatedWorkItemsByUID + workItemUID
    );
    return response;
  }

  async GetProjectsByEmployeeUID(employeeUID: string) {
    let response = await this.http.get(
      Constants.GetProjectsByEmployeeUID + employeeUID
    );
    return response;
  }

  async GetEmployeeDetailsByProjectUID(projectUID: string) {
    let response = await this.http.get(
      Constants.GetEmployeeDetailsByProjectUID + projectUID
    );
    return response;
  }

  async GetStoryPointDigits() {
    let digits = Constants.StoryPointDigits;
    return digits;
  }
}

export default new CollabWorkSerive();
