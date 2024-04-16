import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { WorkItem } from "../../../Model/WorkItem";
import { useSelector } from "react-redux";
import { StateModel } from "../../../State/StateModel";
import NavBar from "../../Navbar/Navbar";
import "./FetchWorkItem.css";
import Constants from "../../../Utilities/Constants";
import CollabWorkService from "../../../Services/CollabWorkService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import UserLogin from "../../Login/UserLogin";
import AddWorkItem from "../AddWorkItem/AddWorkItem";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const FetchWorkItem = () => {
  const stateDetails = useSelector((state: StateModel) => state);

  const navigate = useNavigate();

  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const imageAddress = Constants.ImageAddress;

  const [hoveredWorkItem, setHoveredWorkItem] = useState<string | null>(null);
  const [isAddWorkItemModalOpen, setIsAddWorkItemModalOpen] = useState(false);
  const openAddWorkItemModal = () => {
    setIsAddWorkItemModalOpen(true);
  };

  const closeAddWorkItemModal = () => {
    setIsAddWorkItemModalOpen(false);
  };

  const fetchWorkItems = async (projectUID: string) => {
    try {
      const response = await CollabWorkService.FetchAllWorkItems(projectUID);
      if (response.status === 200 || response.status === 201) {
        setWorkItems(response.data);
        console.log("success", response.data);
      } else {
        console.error("Fail", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const localProjectUID = localStorage.getItem("ProjectUID");
    if (stateDetails.projectUID !== "") {
      fetchWorkItems(stateDetails.projectUID);
    } else {
      fetchWorkItems(localProjectUID ?? "");
    }
  }, []);

  const relatedWorkItem = (workItemUID: string) => {
    navigate(`/workItemDetails/${workItemUID}`);
  };

  const handleBackPage = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar />
      <div className="fetchWorkItem-mainDiv">
        <h1 className="workItemHeading">Work Items</h1>
        <button
          className="fetchWorkItem-button"
          onClick={() => openAddWorkItemModal()}
        >
          Add Work Item
        </button>
        {isAddWorkItemModalOpen && (
          <AddWorkItem closeModal={closeAddWorkItemModal} />
        )}
        <button
          type="button"
          className="fetchworkItem-backbutton"
          onClick={handleBackPage}
        >
          Back
        </button>
        <div className="projects">
          <table className="workItemsTable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Story Point</th>
              </tr>
            </thead>
            <tbody>
              {workItems.map((workItem, index) => (
                <tr
                  key={workItem.uid}
                  onMouseEnter={() => setHoveredWorkItem(workItem.uid)}
                  onMouseLeave={() => setHoveredWorkItem(null)}
                  className={`workItem ${
                    hoveredWorkItem !== null ? "hovered" : ""
                  }`}
                >
                  <td className="workItemTitle">
                    <div
                      className="workItem-iconDiv"
                      onClick={() => relatedWorkItem(workItem.uid)}
                    >
                      {index + 1}.
                      <img
                        src={require(`../Assets/${workItem.imagePath}`)}
                        alt="workItem-Icon"
                        className="workItem-icon"
                        style={{ marginLeft: "5px" }}
                      />
                      {workItem.name}
                    </div>
                  </td>
                  <td>{workItem.assignedTo}</td>
                  <td>{workItem.status}</td>
                  <td>{workItem.storyPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
        </div>
      </div>
    </div>
  );
};

export default FetchWorkItem;
