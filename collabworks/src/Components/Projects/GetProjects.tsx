import React, { useState, useEffect } from "react";
import axios from "axios";
import { Project } from "../../Model/Project";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProjectUID } from "../../State/ActionCreators";
import { StateModel } from "../../State/StateModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./GetProjects.css";
import NavBar from "../Navbar/Navbar";
import CollabWorkService from "../../Services/CollabWorkService";
import { Employee } from "../../Model/Employee";

const GetProjects = () => {
  const navigate = useNavigate();
  const { guid } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const dispatch = useDispatch();
  const collabWorks = useSelector((state: StateModel) => state);

  const fetchProjects = async (guid: string) => {
    const response = await CollabWorkService.GetProjectsByEmployeeUID(guid);
    if (response.status === 200 || response.status === 201) {
      const projectData = response.data;
      if (projectData.length > 0 && projectData[0].uid !== null) {
        setProjects(projectData);
        fetchEmployeeDetails(projectData[0].uid);
      }
    } else {
      console.error("Get Projects Failed", response.statusText);
    }
  };

  const fetchEmployeeDetails = async (projectUID: string) => {
    const response = await CollabWorkService.GetEmployeeDetailsByProjectUID(
      projectUID
    );
    if (response.status === 200 || response.status === 201) {
      console.log(response.data);
      setEmployeeDetails(response.data);
    } else {
      console.error("Get Employee Details Failed", response.statusText);
    }
  };

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.slice(0, 2))
      .join("");
    return initials.toUpperCase();
  };
  useEffect(() => {
    fetchProjects(guid ?? "");
  }, [guid]);

  const workItem = (projectUID: string) => {
    collabWorks.projectUID = projectUID;
    dispatch(setProjectUID(collabWorks));
    localStorage.setItem("ProjectUID", collabWorks.projectUID);
    navigate("/fetchWorkItem");
  };

  return (
    <div>
      <NavBar />
      <h1 className="project-heading">Your Project</h1>
      <div className="project-mainDiv">
        {projects.map((project) => (
          <div
            key={project.uid}
            className="project-card"
            onClick={() => workItem(project.uid)}
          >
            <div className="project-left-column">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-right-column">
              {employeeDetails.length > 0 && (
                <div className="employee-details">
                  {employeeDetails.slice(0, 3).map((employee, index) => (
                    <span key={index} title={employee.name}>
                      <div className="initial-circle">
                        {getInitials(employee.name)}
                      </div>
                    </span>
                  ))}
                  {employeeDetails.length > 3 && (
                    <span className="remaining-count">
                      +{employeeDetails.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetProjects;
