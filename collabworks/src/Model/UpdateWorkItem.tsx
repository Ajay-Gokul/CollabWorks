export interface UpdateWorkItem {
  uid?: string;
  name: string;
  storyPoint?: number;
  description?: string;
  assignedTo?: string;
  status?: string;
}
