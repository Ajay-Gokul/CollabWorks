import React, { useState, useEffect } from "react";
import axios from "axios";
import { WorkItem } from "../../../Model/WorkItem";
import { useSelector } from "react-redux";
import { StateModel } from "../../../State/StateModel";
import { Project } from "../../../Model/Project";
import CollabWorkService from "../../../Services/CollabWorkService";
import "./AddWorkItem.css";
import { log } from "console";
import { FormProperties, WorkItemList } from "../../../Model/FormProperties";
import { parentWorkItem } from "../../../Model/ParentWorkItem";
import { ParentWorkItemDetails } from "../../../Model/ParentWorkItemDetails";
import NavBar from "../../Navbar/Navbar";
import { useToasts } from "react-toast-notifications";
import Modal from "react-modal";

interface AddWorkItemModalProps {
  closeModal: () => void;
}

const AddWorkItem = ({ closeModal }: AddWorkItemModalProps) => {
  const { addToast } = useToasts();
  const userDetails = useSelector((state: StateModel) => state);
  const [projectDetails, setProjectDetails] = useState<Project>();
  const [formProperties, setFormProperties] = useState<FormProperties>();
  const [isFormValid, setIsFormValid] = useState(false);
  var loggedInUser = "";
  const [parentWorkItemInfo, setParentWorkItemInfo] =
    useState<ParentWorkItemDetails[]>();
  const workItemUID = useSelector((state: StateModel) => state);
  const [isParentNameValid, setIsParentNameValid] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const localProjectUID = localStorage.getItem("ProjectUID");
  const localName = localStorage.getItem("Name");
  const localRole = localStorage.getItem("Role");
  const [storyPoints, setStoryPoints] = useState<number[]>([]);
  const [workItem, setWorkItem] = useState({
    uid: "00000000-0000-0000-0000-000000000000",
    name: "",
    storyPoint: 0,
    description: "",
    workItemType: "",
    status: "",
    assignedTo: "",
    projectName: projectDetails?.name,
    creator: userDetails.name,
    parentName: "",
    sprintName: "",
    imagePath: "",
    relatedWorkItems: [],
    workItemView: "dummy value",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const digits = await CollabWorkService.GetStoryPointDigits();
        setStoryPoints(digits);
      } catch (error) {
        console.error("Error fetching story points:", error);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const { name, sprintName, workItemType, status, assignedTo } = workItem;

    setIsFormValid(
      name.trim() !== "" &&
        sprintName.trim() !== "" &&
        workItemType.trim() !== "" &&
        status.trim() !== "" &&
        assignedTo.trim() !== ""
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "workItemType" && value === "Feature") {
      setWorkItem({
        ...workItem,
        [name]: value,
        storyPoint: 0,
      });
    } else {
      setWorkItem({
        ...workItem,
        [name]: value,
      });
    }

    if (name === "projectName" || name === "workItemType") {
      GetImmediateWorkItemParents(projectDetails?.name ?? " ", value);
    }
    if (name === "workItemType" || value === "Feature") {
      setIsParentNameValid(true);
    }
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const projectName: string = projectDetails?.name || "";

      const response = await CollabWorkService.AddWorkItem({
        ...workItem,
        projectName,
      });
      if (response.status === 200 || response.status === 201) {
        addToast("Work item added successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
        setWorkItem(response.data);
        closeModal();
      }
    } catch (error: any) {
      if (error.response.status === 500) {
        addToast("Work item name already exists", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    }
  };

  const GetProjectName = async (projectUID: string) => {
    try {
      const response = await CollabWorkService.GetProjetNames(projectUID);
      if (response.status === 200 || response.status === 201) {
        setProjectDetails(response.data);
      } else {
        console.error("unsuccessfull", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetFormProperties = async (projectUID: string) => {
    try {
      const response = await CollabWorkService.GetFormProperties(projectUID);
      if (response.status === 200 || response.status === 201) {
        setFormProperties(response.data);
        console.log("formProperties", response.data);
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetImmediateWorkItemParents = async (
    projectNames: string,
    workItemType: string
  ) => {
    try {
      console.log(projectNames, workItemType);

      const response = await CollabWorkService.GetParentWorkItems({
        projectNames,
        workItemType,
      });
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);

        setParentWorkItemInfo(response.data);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userDetails.role !== "") {
    loggedInUser = userDetails.role;
  } else {
    loggedInUser = localRole ?? "";
  }

  useEffect(() => {
    if (userDetails.projectUID !== "") {
      GetFormProperties(userDetails.projectUID);
      GetProjectName(userDetails.projectUID);
    } else {
      GetFormProperties(localProjectUID ?? "");
      GetProjectName(localProjectUID ?? "");
    }
  }, [userDetails.projectUID]);

  useEffect(() => {
    if (userDetails.name !== "") {
      setWorkItem((workItem) => ({
        ...workItem,
        projectName: projectDetails?.name,
        creator: userDetails.name,
      }));
    } else {
      setWorkItem((workItem) => ({
        ...workItem,
        projectName: projectDetails?.name,
        creator: localName ?? "",
      }));
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, []);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="addWorkItem-modal"
    >
      <div>
        <div className="add-work-item-body">
          <div className="add-work-item-container">
            <form onSubmit={handleSubmit}>
              <h1 className="addWorkItem-Heading">Add Work Item</h1>
              <div className="addWorkItem-close-div">
                <p className="addWorkItem-close-button" onClick={closeModal}>
                  <b style={{ cursor: "pointer" }}>X</b>
                </p>
              </div>
              <div className="addWorkItem-form-row">
                <div className="addWorkItem-form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={workItem.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="addWorkItem-form-group">
                  <label>Work Item Type:</label>
                  <select
                    id="workItemType"
                    name="workItemType"
                    onChange={handleChange}
                    value={workItem.workItemType}
                  >
                    <option value="">Select Work Item Type</option>
                    {formProperties?.workItemTypes &&
                      formProperties.workItemTypes
                        .filter(
                          (workItemType) =>
                            !(
                              !["Manager", "Architect"].includes(
                                loggedInUser
                              ) &&
                              (workItemType.name === "Feature" ||
                                workItemType.name === "User Story")
                            )
                        )
                        .map((workItemType) => (
                          <option
                            key={workItemType.uid}
                            value={workItemType.name}
                          >
                            {workItemType.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="addWorkItem-form-row">
                <div className="addWorkItem-form-group">
                  <label>Sprint Name:</label>
                  <select
                    id="sprintName"
                    name="sprintName"
                    onChange={handleChange}
                    value={workItem.sprintName}
                  >
                    <option value="">Select Sprint Name</option>
                    {formProperties?.sprints &&
                      formProperties.sprints.map((sprint) => (
                        <option key={sprint.uid} value={sprint.name}>
                          {sprint.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="addWorkItem-form-group">
                  <label>Story point: </label>
                  <select
                    id="storyPoint"
                    name="storyPoint"
                    onChange={handleChange}
                    value={
                      workItem.workItemType === "Feature"
                        ? 0
                        : workItem.storyPoint
                    }
                    disabled={workItem.workItemType === "Feature"}
                  >
                    <option value="">
                      {workItem.workItemType === "Feature"
                        ? 0
                        : "Select Story Point"}
                    </option>
                    {storyPoints.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="addWorkItem-form-row">
                <div className="addWorkItem-form-group">
                  <label>Status:</label>
                  <select
                    id="status"
                    name="status"
                    onChange={handleChange}
                    value={workItem.status}
                  >
                    <option value="">Select Status</option>
                    {formProperties?.workItemStatuses &&
                      formProperties.workItemStatuses.map((status) => (
                        <option key={status.uid} value={status.name}>
                          {status.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="addWorkItem-form-group">
                  <label>Assigned To:</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    onChange={handleChange}
                    value={workItem.assignedTo}
                  >
                    <option value="">Select Assigned To</option>
                    {formProperties?.employeeLists &&
                      formProperties.employeeLists.map((employee) => (
                        <option key={employee.uid} value={employee.name}>
                          {employee.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="addWorkItem-form-row">
                <div className="addWorkItem-form-group">
                  <label>Parent Name:</label>
                  <select
                    id="parentName"
                    name="parentName"
                    onChange={handleChange}
                    value={workItem.parentName}
                    disabled={workItem.workItemType === "Feature"}
                  >
                    <option value="">Select Parent Name</option>
                    {parentWorkItemInfo &&
                      parentWorkItemInfo.map((parentWorkItem) => (
                        <option
                          key={parentWorkItem.uid}
                          value={parentWorkItem.name}
                        >
                          {parentWorkItem.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="addWorkItem-form-group">
                  <label>Description:</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={workItem.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`add-button ${isFormValid ? "" : "disabled"}`}
                disabled={!isFormValid}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddWorkItem;
