export interface WorkItemType {
  uid: string;
  name: string;
}

export interface WorkItemStatus {
  uid: string;
  name: string;
}

export interface SprintList {
  uid: string;
  name: string;
}

export interface Employee {
  uid: string;
  name: string;
}

export interface WorkItemList {
  uid: string;
  name: string;
}

export interface Manager {
  uid: string;
  name: string;
}

export interface Department {
  uid: string;
  name: string;
}

export interface Project {
  uid: string;
  name: string;
  description: string;
}

export interface EmployeeTypes {
  uid: string;
  name: string;
}

export interface FormProperties {
  workItemTypes: WorkItemType[];
  workItemStatuses: WorkItemStatus[];
  sprints: SprintList[];
  employeeLists: Employee[];
  workItemLists: WorkItemList[];
  managersList: Manager[];
  departments: Department[];
  projects: Project[];
  employeeTypes: EmployeeTypes[];
}
