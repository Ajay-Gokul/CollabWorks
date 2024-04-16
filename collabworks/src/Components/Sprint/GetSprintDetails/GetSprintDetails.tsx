import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { WorkItem } from "../../../Model/WorkItem";
import { Sprint } from "../../../Model/Sprint";
import WorkItemHierarchy from "../WorkItemHierarchy/WorkItemHierarchy";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StateModel } from "../../../State/StateModel";
import NavBar from "../../Navbar/Navbar";
import AddSprint from "../AddSprint/AddSprint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./GetSprintDetails.css";
import { useToasts } from "react-toast-notifications";
import CollabWorkService from "../../../Services/CollabWorkService";
const GetSprintDetails = () => {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [sprintDetails, setSprintDetails] = useState<Sprint[]>([]);
  const [currentSprint, setCurrenSprint] = useState<string>();
  const [workingDays, setWorkingDays] = useState<number>();
  const [sprintStartDay, setSprintStartDay] = useState<number>();
  const [sprintStartMonth, setSprintStartMonth] = useState<string>();
  const [sprintEndDay, setSprintEndDay] = useState<number>();
  const [sprintEndMonth, setSprintEndMonth] = useState<string>();

  const userDetails = useSelector((state: StateModel) => state);
  const [isAddSprintModalOpen, setIsAddSprintModalOpen] = useState(false);

  const openAddSprintModal = () => {
    addToast("Please remember to enter valid date", {
      appearance: "warning",
      autoDismiss: true,
      autoDismissTimeout: 3000,
    });
    setIsAddSprintModalOpen(true);
  };

  const closeAddSprintModal = () => {
    setIsAddSprintModalOpen(false);
  };

  const fetchWorkItems = async (sprintUID: string) => {
    try {
      const response = await CollabWorkService.GetWorkItemBySprintUID(
        sprintUID
      );
      if (response.status === 200 || response.status === 201) {
        setWorkItems(response.data);
        console.log("success WI", workItems);
      } else {
        console.log("Fail", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching work items:", error);
    }
  };

  const handleSelectSprint = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSprintUID = event.target.value;

    setCurrenSprint(selectedSprintUID);
    if (selectedSprintUID) {
      fetchWorkItems(selectedSprintUID);
    }
  };

  const fetchSprintDetails = async (ProjectUID: string) => {
    try {
      const response = await CollabWorkService.GetSprintByProjectUID(
        ProjectUID
      );

      if (response.status === 200 || response.status === 201) {
        setSprintDetails(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateSprintDetails = (newSprint: Sprint) => {
    setSprintDetails((prevSprints) => [...prevSprints, newSprint]);
  };

  useEffect(() => {
    const currentDate = new Date();

    const defaultSprint = sprintDetails.find(
      (sprint) =>
        new Date(sprint.startDate) <= currentDate &&
        new Date(sprint.endDate) >= currentDate
    );

    if (defaultSprint) {
      setCurrenSprint(defaultSprint.uid);
    }
  }, [sprintDetails]);

  useEffect(() => {
    if (currentSprint) {
      fetchWorkItems(currentSprint);
    }
  }, [currentSprint]);

  const calcultaeWorkingDays = () => {
    const sprint: Sprint | undefined = sprintDetails.find(
      (s) => s.uid == currentSprint
    );
    if (!sprint) return;
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);

    const startDay = new Date(sprint.startDate).getDate();
    setSprintStartDay(startDay);
    const startMonth = new Date(sprint.startDate).toLocaleString("default", {
      month: "long",
    });
    setSprintStartMonth(startMonth);
    const endDay = new Date(sprint.endDate).getDate();
    setSprintEndDay(endDay);
    const endMonth = new Date(sprint.endDate).toLocaleString("default", {
      month: "long",
    });
    setSprintEndMonth(endMonth);

    let count = 0;
    let current = new Date(Date.now());

    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    setWorkingDays(count);
  };

  useEffect(() => {
    calcultaeWorkingDays();
  }, [currentSprint]);

  const getSprintStatus = (sprintDetail: Sprint) => {
    console.log(sprintDetail);
    const currentDate = new Date(Date.now());
    const startDate = new Date(sprintDetail.startDate);
    const endDate = new Date(sprintDetail.endDate);

    if (currentDate < startDate) {
      return "Future";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "Present";
    } else if (currentDate >= startDate && currentDate >= endDate) {
      return "Past";
    }
  };

  const isAuthorized = () => {
    const localRole = localStorage.getItem("Role");
    if (
      (userDetails.role !== "" && userDetails.role === "Manager") ||
      userDetails.role === "Architect"
    ) {
      return true;
    } else if (
      (localRole !== null && localRole === "Manager") ||
      localRole === "Architect"
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {}, [workItems]);

  useEffect(() => {
    const projectUID = localStorage.getItem("ProjectUID");
    if (userDetails.projectUID !== "") {
      fetchSprintDetails(userDetails.projectUID);
    } else if (projectUID !== null) {
      fetchSprintDetails(projectUID);
    }
  }, [userDetails]);

  const handleBackPage = () => {
    navigate(-1);
  };
  return (
    <div>
      <NavBar />
      <div className="sprint-mainDiv">
        <div className="sprint-top">
          <h1 className="sprint-h1">Sprint Details</h1>

          {isAuthorized() && (
            <button
              type="button"
              className="sprint-button"
              onClick={openAddSprintModal}
            >
              Add New Sprint
            </button>
          )}

          <div className="workingDays">
            <div>
              {sprintStartMonth} {sprintStartDay} - {sprintEndMonth}{" "}
              {sprintEndDay}
            </div>
            <p> {workingDays} working days remaining</p>

            <div className="sprints">
              <select onChange={handleSelectSprint} value={currentSprint}>
                {sprintDetails &&
                  sprintDetails.map((sprintDetail) => (
                    <option key={sprintDetail.uid} value={sprintDetail.uid}>
                      {sprintDetail.name} - {getSprintStatus(sprintDetail)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {isAddSprintModalOpen && (
            <AddSprint
              closeModal={closeAddSprintModal}
              updateSprintDetails={updateSprintDetails}
            />
          )}
          <button
            type="button"
            className="sprintDetails-backbutton"
            onClick={handleBackPage}
          >
            Back
          </button>
        </div>
        <div
          className="workItemTable"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <table className="workItemHierarchy-heading">
            <thead>
              <tr>
                <th style={{ position: "relative", left: "70px" }}>Name</th>
                <th style={{ position: "relative", left: "80px" }}>
                  Assigned To
                </th>
                <th style={{ position: "relative", left: "5px" }}>Status</th>
                <th style={{ position: "relative", left: "40px" }}>Type</th>
                <th style={{ position: "relative", right: "20px" }}>
                  Story Points
                </th>
              </tr>
            </thead>
          </table>
          <div className="workItemHierarchy-border">
            {workItems.length <= 0 && <p>No Work Items added</p>}
            {workItems.map((item: WorkItem, index) => {
              return <WorkItemHierarchy key={index} workItemProps={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSprintDetails;
