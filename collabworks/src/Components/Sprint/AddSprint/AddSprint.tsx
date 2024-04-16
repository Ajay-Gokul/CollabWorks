import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useSelector } from "react-redux";
import "./AddSprint.css";
import { StateModel } from "../../../State/StateModel";
import NavBar from "../../Navbar/Navbar";
import { useToasts } from "react-toast-notifications";
import CollabWorkService from "../../../Services/CollabWorkService";
import { Sprint } from "../../../Model/Sprint";

interface AddSprintProps {
  closeModal: () => void;
  updateSprintDetails: (newSprint: Sprint) => void;
}

const AddSprint = ({ closeModal, updateSprintDetails }: AddSprintProps) => {
  const { addToast } = useToasts();
  const [isFormValid, setIsFormValid] = useState(false);
  const [sprintDetails, setSprintDetails] = useState({
    uid: "00000000-0000-0000-0000-000000000000",
    name: "",
    startDate: "",
    endDate: "",
    projectName: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const validateForm = () => {
    const { name, startDate, endDate, projectName } = sprintDetails;
    const isStartDateValid = new Date(startDate) >= new Date();
    const isEndDateValid = new Date(endDate) >= new Date(startDate);

    setIsFormValid(
      name.trim() !== "" &&
        startDate.trim() !== "" &&
        endDate.trim() !== "" &&
        projectName.trim() !== "" &&
        isStartDateValid &&
        isEndDateValid
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSprintDetails({
      ...sprintDetails,
      [name]: value,
    });
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await CollabWorkService.AddSprint(sprintDetails);
      if (response.status === 200 || response.status === 201) {
        addToast("Sprint added successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
        setSprintDetails(response.data);
        updateSprintDetails(response.data);
        closeModal();
      }
    } catch (error: any) {
      if (error.response.status === 500) {
        addToast("Can't add sprint", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [sprintDetails]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="sprint-modal"
    >
      <form onSubmit={handleSubmit} className="addSprint-form">
        <h3 className="addSprint-heading">Add Sprint</h3>
        <div className="addSprint-close-div">
          <p className="addSprint-close-button" onClick={closeModal}>
            <b style={{ cursor: "pointer" }}>X</b>
          </p>
        </div>
        <label className="addSprint-label">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="addSprint-input"
          value={sprintDetails.name}
          onChange={handleChange}
        />

        <label className="addSprint-label">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className="addSprint-input"
          value={sprintDetails.startDate}
          onChange={handleChange}
        />

        <label className="addSprint-label">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          className="addSprint-input"
          value={sprintDetails.endDate}
          onChange={handleChange}
        />

        <label className="addSprint-label">Project Name:</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          className="addSprint-input"
          value={sprintDetails.projectName}
          onChange={handleChange}
        />

        <button
          type="submit"
          className={`addSprint-button ${isFormValid ? " " : "disabled"}`}
          disabled={!isFormValid}
        >
          Add
        </button>
      </form>
    </Modal>
  );
};

export default AddSprint;
