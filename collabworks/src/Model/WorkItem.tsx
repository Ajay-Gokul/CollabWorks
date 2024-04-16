export interface WorkItem {
  uid: string;
  name: string;
  imagePath: string;
  storyPoint: number;
  description: string;
  workItemType: string;
  status: string;
  assignedTo: string;
  projectName: string;
  creator: string;
  parentName: string;
  sprintName: string;
  relatedWorkItems: WorkItem[];
}
