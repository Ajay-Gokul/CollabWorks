import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { WorkItem } from "../../../Model/WorkItem";
import { StringLiteral } from "typescript";
import { useSelector } from "react-redux";
import { StateModel } from "../../../State/StateModel";
import NavBar from "../../Navbar/Navbar";
import Constants from "../../../Utilities/Constants";
import { useDispatch } from "react-redux";
import "./WorkItemDetails.css";
import { setProjectUID } from "../../../State/ActionCreators";
import CollabWorkService from "../../../Services/CollabWorkService";
import { FormProperties } from "../../../Model/FormProperties";
import { useToasts } from "react-toast-notifications";
import { UpdateWorkItem } from "../../../Model/UpdateWorkItem";
import AddWorkItems from "../AddWorkItem/AddWorkItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const WorkItemDetails = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const { workItemUID } = useParams();
  const imageAddress = Constants.ImageAddress;
  const [workItem, setWorkItem] = useState<WorkItem>();
  const stateDetails = useSelector((state: StateModel) => state);
  const [isFormValid, setIsFormValid] = useState(false);
  const localRole = localStorage.getItem("Role");
  const localProjectUID = localStorage.getItem("ProjectUID");
  const [storyPoints, setStoryPoints] = useState<number[]>([]);
  const [initialUpdateWorkItem, setInitialUpdateWorkItem] =
    useState<UpdateWorkItem>({
      uid: "",
      name: "",
      storyPoint: 0,
      description: "",
      assignedTo: "",
      status: "",
    });

  const [updateWorkItem, setUpdateWorkItem] = useState<UpdateWorkItem>({
    uid: "",
    name: "",
    storyPoint: 0,
    description: "",
    assignedTo: "",
    status: "",
  });
  const [formProperties, setFormProperties] = useState<FormProperties>();

  const [relatedWorkItems, setRelatedWorkItems] = useState<WorkItem[] | null>(
    null
  );
  const [showAddButton, setShowAddButton] = useState(true);
  const [isAddWorkItemModalOpen, setIsAddWorkItemModalOpen] = useState(false);
  const openAddWorkItemModal = (addWorkItemUID: WorkItem) => {
    stateDetails.workItemUID = addWorkItemUID.uid;
    stateDetails.workItemType = addWorkItemUID.workItemType;
    localStorage.setItem("WorkItemUID", addWorkItemUID.uid);
    dispatch(setProjectUID(stateDetails));
    setIsAddWorkItemModalOpen(true);
  };

  const closeAddWorkItemModal = () => {
    setIsAddWorkItemModalOpen(false);
  };
  const validateForm = () => {
    const isFormChanged =
      JSON.stringify(updateWorkItem) !== JSON.stringify(initialUpdateWorkItem);
    setIsFormValid(isFormChanged);
  };

  useEffect(() => {
    if (stateDetails.role === "Manager" || stateDetails.role === "Architect") {
      setShowAddButton(true);
    } else if (localRole === "Manager" || localRole === "Architect") {
      setShowAddButton(true);
    } else {
      setShowAddButton(false);
    }
  }, []);

  const GetFormProperties = async (projectUID: string) => {
    try {
      const response = await CollabWorkService.GetFormProperties(projectUID);
      if (response.status === 200 || response.status === 201) {
        console.log("formProperties", response.data);
        setFormProperties(response.data);
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("Description", updateWorkItem.description);

  const updateWorkItemInfo = async () => {
    try {
      const response = await CollabWorkService.UpdateWorkItems(updateWorkItem);
      if (response.status === 200 || response.status === 201) {
        setIsFormValid(false);
        addToast("Successfully updated", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    } catch (error: any) {
      console.log("Error updating work item", error);
      if (error.response.status === 500) {
        addToast("Update unsuccessful", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    }
  };

  const fetchWorkItem = async (WorkItemUID: string | undefined) => {
    try {
      const response = await CollabWorkService.GetWorkItemByUID(WorkItemUID);
      if (response.status === 200 || response.status === 201) {
        const fetchedWorkItem = response.data;
        setWorkItem(fetchedWorkItem);
        console.log("success", fetchedWorkItem);
      } else {
        console.log("Fail", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching work item:", error);
    }
  };

  const fetchRelatedWorkItem = async (workItemUID: string) => {
    try {
      const response = await CollabWorkService.GetRelatedWorkItemsByUID(
        workItemUID
      );
      if (response.status === 200 || response.status === 201) {
        setRelatedWorkItems(response.data);
        console.log("success", response.data);
      } else {
        console.log("Fail", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching work item:", error);
    }
  };

  const handleBackPage = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (workItem) {
      setUpdateWorkItem({
        uid: workItem.uid,
        name: workItem.name,
        storyPoint: workItem.storyPoint,
        description: workItem.description,
        assignedTo: workItem.assignedTo,
        status: workItem.status,
      });
      setInitialUpdateWorkItem({
        uid: workItem.uid,
        name: workItem.name,
        storyPoint: workItem.storyPoint,
        description: workItem.description,
        assignedTo: workItem.assignedTo,
        status: workItem.status,
      });
      if (workItem.workItemType === "Task" || workItem.workItemType === "Bug") {
        setShowAddButton(false);
      }
    }
  }, [workItem]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateWorkItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateForm();
  };

  const updateRelatedWorkItems = (newWorkItem: WorkItem | null) => {
    if (newWorkItem) {
      setRelatedWorkItems((prevRelatedWorkItems) => {
        if (prevRelatedWorkItems !== null) {
          return [...prevRelatedWorkItems, newWorkItem];
        } else {
          return [newWorkItem];
        }
      });
    }
  };

  useEffect(() => {
    fetchRelatedWorkItem(workItemUID ?? "");
    fetchWorkItem(workItemUID);
  }, [workItemUID]);

  useEffect(() => {
    validateForm();
  }, [updateWorkItem, initialUpdateWorkItem]);

  useEffect(() => {
    const localProjectUID = localStorage.getItem("ProjectUID");

    if (stateDetails.projectUID !== "") {
      GetFormProperties(stateDetails.projectUID);
    } else {
      console.log("stateDetails.ProjectUID", stateDetails.projectUID);
      console.log("localProjectUID", localProjectUID);
      GetFormProperties(localProjectUID ?? "");
    }
  }, []);

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

  const goToWorkItemDetails = (workItemUID: string) => {
    navigate(`/workItemDetails/${workItemUID}`);
  };

  return (
    <>
      <div className="workItemDetails-mainDiv">
        <NavBar />
        <div className="workItemDetails">
          {workItem && (
            <>
              <div className="workItemDetails-headers">
                <h1 className="workItemDetails-heading">Work Item Details</h1>
                <button
                  type="button"
                  className="workItemDetailsBack-button"
                  onClick={handleBackPage}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`workItemDetails-button ${
                    isFormValid ? "" : "disabled"
                  }`}
                  disabled={!isFormValid}
                  onClick={() => updateWorkItemInfo()}
                >
                  Update
                </button>
              </div>
              <div className="workItemDetails-info">
                <div className="workItemDetails-type-name">
                  <label className="workItemDetails-info-type">
                    <b>{workItem.workItemType} </b>:
                  </label>
                  <img
                    src={require(`../Assets/${workItem.imagePath}`)}
                    alt="workItem-Icon"
                    className="workItem-icon"
                    style={{ marginLeft: "5px" }}
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={updateWorkItem.name}
                    onChange={handleChange}
                    className="workItemDetails-name updateInput-field"
                  />
                </div>
                <label className="workItemDetails-info-description">
                  <b>Description:</b>
                </label>
                <textarea
                  id="description"
                  name="description"
                  onChange={handleChange}
                  className="workItemDetails-description"
                  rows={5}
                  cols={80}
                  style={{ marginTop: "5px" }}
                  value={updateWorkItem.description}
                ></textarea>
                <span className="workItemDetails-group">
                  <label className="workItemDetails-info-assignedTo">
                    <b>Assigned To:</b>{" "}
                    <select
                      id="assignedTo"
                      name="assignedTo"
                      className="workItemDetails-assignedTo updateInput-field"
                      value={updateWorkItem.assignedTo}
                      onChange={handleChange}
                    >
                      {formProperties &&
                        formProperties.employeeLists.map((formProperty) => (
                          <option
                            key={formProperty.uid}
                            value={formProperty.name}
                          >
                            {formProperty.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="workItemDetails-info-storyPoint">
                    <b>Story Point:</b>{" "}
                    <select
                      id="storyPoint"
                      name="storyPoint"
                      className="workItemDetails-storyPoint updateInput-field"
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
                          : workItem.storyPoint}
                      </option>
                      {storyPoints.map((point) => (
                        <option key={point} value={point}>
                          {point}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="workItemDetails-info-state">
                    <b>State:</b>{" "}
                    <select
                      id="status"
                      name="status"
                      className="workItemDetails-state updateInput-field"
                      value={updateWorkItem.status}
                      onChange={handleChange}
                    >
                      {formProperties &&
                        formProperties.workItemStatuses.map((formProperty) => (
                          <option
                            key={formProperty.uid}
                            value={formProperty.name}
                          >
                            {formProperty.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </span>
              </div>
            </>
          )}
        </div>

        <div className="relatedWorkItem">
          <div className="relatedWorkItem-headers">
            <h3 style={{ fontSize: "x-large" }}>Related Work Items</h3>
            {showAddButton && (
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="addIcon"
                onClick={() => workItem && openAddWorkItemModal(workItem)}
              />
            )}
          </div>
          {relatedWorkItems && relatedWorkItems.length > 0 ? (
            <>
              {relatedWorkItems.map((relatedWorkItem, index) => (
                <div
                  key={relatedWorkItem.uid}
                  className="relatedWorkItem-container"
                >
                  <span
                    onClick={() => goToWorkItemDetails(relatedWorkItem.uid)}
                    className="relatedWorkItem-details"
                    style={{ cursor: "pointer" }}
                  >
                    {index + 1}.
                    <img
                      src={require(`../Assets/${relatedWorkItem.imagePath}`)}
                      alt="workItem-Icon"
                      className="workItem-icon"
                      style={{ marginLeft: "5px" }}
                    />
                    {relatedWorkItem.name}
                  </span>
                  <b />
                </div>
              ))}
            </>
          ) : (
            <div className="relatedWorkItem-container">
              <p>No related work items</p>
            </div>
          )}
        </div>
      </div>
      {isAddWorkItemModalOpen && (
        <AddWorkItems
          closeModal={closeAddWorkItemModal}
          onAdd={fetchRelatedWorkItem}
        />
      )}
    </>
  );
};

export default WorkItemDetails;
