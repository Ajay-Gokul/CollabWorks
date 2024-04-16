import React, { useEffect, useState } from "react";
import "../../Model/Register";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FormProperties, Project } from "../../Model/FormProperties";
import CollabWorkService from "../../Services/CollabWorkService";
import Constants from "../../Utilities/Constants";
import { useSelector } from "react-redux";
import { StateModel } from "../../State/StateModel";
import "./RegisterUser.css";
import NavBar from "../Navbar/Navbar";
import RegisterImage from "./Assets/register.jpg";
import { useToasts } from "react-toast-notifications";
import Modal from "react-modal";
interface RegisterModalProps {
  closeModal: () => void;
}

const RegisterUser = ({ closeModal }: RegisterModalProps) => {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const loginDetails = useSelector((state: StateModel) => state);
  const [formProperties, setFormProperties] = useState<FormProperties>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    departmentName: "",
    role: "",
    email: "",
    reportingToName: "",
    password: "",
    projectName: "",
    employeeTypes: "",
  });

  const validateForm = () => {
    const { name, departmentName, role, email, password, projectName } =
      userDetails;

    setIsFormValid(
      name.trim() !== "" &&
        departmentName.trim() !== "" &&
        role.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        projectName.trim() !== ""
    );
    console.log(isFormValid, "isFormValid");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
    validateForm();
  };

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

  const GetAllProjects = async () => {
    try {
      const response = await CollabWorkService.GetAllProjets();
      if (response.status === 200 || response.status === 201) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = e.target.value;
    const fetchProject = projects.find((projects) => projects.name === project);
    setSelectedProject(fetchProject);

    if (fetchProject) {
      setUserDetails({
        ...userDetails,
        projectName: fetchProject.name,
      });
      GetFormProperties(fetchProject.uid);
      setSelectedProject(fetchProject);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      debugger;
      const response = await CollabWorkService.RegisterUser(userDetails);
      if (response.status === 200 || response.status === 201) {
        console.log("registration successful", userDetails);
        setUserDetails({
          name: "",
          departmentName: "",
          role: "",
          email: "",
          reportingToName: "",
          password: "",
          projectName: "",
          employeeTypes: "",
        });
        console.log("Register Toast");
        addToast("Registration successful, please login to continue", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
        closeModal();
      }
    } catch (error: any) {
      console.error("Register error", error);
      if (error.response.status === 500) {
        addToast("Email Id already exists", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [userDetails]);

  useEffect(() => {
    GetAllProjects();
  }, []);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="addWorkItem-modal"
    >
      <div className="register-mainDiv">
        <form onSubmit={handleSubmit}>
          <h1 className="register-Heading">Register</h1>
          <div className="register-input-row">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
            ></input>
          </div>
          <div className="register-input-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="eMail"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
            ></input>
          </div>
          <div className="register-input-row">
            {projects && (
              <>
                <label htmlFor="project">Select Project:</label>
                <select
                  onChange={handleProjectChange}
                  value={userDetails.projectName}
                  name="projectName"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.uid} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <div className="register-input-row">
            <label htmlFor="role">Role:</label>
            <>
              <select
                onChange={handleChange}
                value={userDetails.role}
                name="role"
              >
                <option value="">Select Role</option>
                {formProperties?.employeeTypes.map((employeeType) => (
                  <option key={employeeType.uid} value={employeeType.name}>
                    {employeeType.name}
                  </option>
                ))}
              </select>
            </>
          </div>
          <div className="register-input-row">
            <>
              <label htmlFor="department">Select Department:</label>
              <select
                name="departmentName"
                value={userDetails.departmentName}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {formProperties?.departments.map((department) => (
                  <option key={department.uid} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </>
          </div>
          <div className="register-input-row">
            <>
              <label htmlFor="manager">Select Manager:</label>
              <select
                name="reportingToName"
                value={userDetails.reportingToName}
                onChange={handleChange}
              >
                <option value="">Select Manager</option>
                {formProperties?.managersList.map((manager) => (
                  <option key={manager.uid} value={manager.name}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </>
          </div>
          <div className="register-input-row">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userDetails.password}
              onChange={handleChange}
            ></input>
          </div>
          <button
            type="submit"
            className={`register-button ${isFormValid ? "" : "disabled"}`}
            disabled={!isFormValid}
          >
            Register
          </button>
          <a
            className="login-registerButton"
            onClick={() => navigate("/userLogin")}
          >
            Click here to go back
          </a>
        </form>
      </div>
    </Modal>
  );
};

export default RegisterUser;
