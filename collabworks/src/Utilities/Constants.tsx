export default class Constants {
  public static readonly ImageAddress = `https://drive.google.com/uc?export=view&id=`;
  public static readonly BaseURL = "http://localhost:5296/api/";
  public static readonly Login = "User/LoginEmployees";
  public static readonly Register = "User/RegisterEmployees";
  public static readonly GetProjects = "Project/GetProjectsByEmployeeID";
  public static readonly GetAllProjects = "Project/GetAllProjects";
  public static readonly GetHomePageImages =
    "HomePageImage/GetAllHomePageImages";
  public static readonly GetFormProperties =
    "FormProperties/GetAllFormProperties?projectUID=";
  public static readonly FetchWorkItems = "WorkItems/GetWorkItems?UID=";
  public static readonly FetchProjectName = "Project/GetProjectsByUID?guid=";
  public static readonly UpdateWorkItem = "WorkItems/UpdateWorkItems";
  public static readonly AddWorkItem = "WorkItems/AddWorkItems";
  public static readonly GetAllParentWorkItems =
    "WorkItems/GetAllParentWorkItems";
  public static readonly AddSprint = "Sprint/AddSprints";
  public static readonly GetWorkItemByUID = "WorkItems/GetWorkItemByUID?key=";
  public static readonly GetWorkItemBySprintUID =
    "WorkItems/GetWorkItemBySprint?key=";
  public static readonly GetSprintByProjectUID =
    "Sprint/GetAllSprintsByProjectUID?projectUID=";
  public static readonly GetRelatedWorkItemsByUID =
    "WorkItems/GetRelatedWorkItems?key=";
  public static readonly GetProjectsByEmployeeUID =
    "Project/GetProjectsByEmployeeID?guid=";
  public static readonly GetEmployeeDetailsByProjectUID =
    "Employee/GetAllEmployeeDetails?projectUID=";
  public static readonly StoryPointDigits = [0.5, 1, 3, 5, 8, 13];
}
