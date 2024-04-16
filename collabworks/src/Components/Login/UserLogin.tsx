import React, { useState, useEffect } from "react";
import "../../Model/Login";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../Model/Login";
import { useSelector, useDispatch } from "react-redux";
import { StateModel } from "../../State/StateModel";
import { setLoggedInUserDetails } from "../../State/ActionCreators";
import "./UserLogin.css";
import NavBar from "../Navbar/Navbar";
import CollabWorkService from "../../Services/CollabWorkService";
import { useToasts } from "react-toast-notifications";
import LoginPage from "./Assets/login.jpg";
import Modal from "react-modal";
import RegisterUser from "../Register/RegisterUser";
interface UserLoginModalProps {
  closeModal: () => void;
  openRegisterModal: () => void;
}

const UserLogin = ({ closeModal, openRegisterModal }: UserLoginModalProps) => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const [userDetails, setUserDetails] = useState({
    mail: "",
    uid: "00000000-0000-0000-0000-000000000000",
    name: "",
    password: "",
    role: "",
    token: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const collabWorks = useSelector((state: StateModel) => state);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openRegisterModalLocal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await CollabWorkService.Login(userDetails);
      if (response.status === 200 || response.status === 201) {
        console.log("login successfull", response.data);
        const updatedCollabWorks = {
          ...collabWorks,
          uid: response.data.uid,
          mail: response.data.mail,
          name: response.data.name,
          password: response.data.password,
          role: response.data.role,
          token: response.data.token,
        };

        dispatch(setLoggedInUserDetails(updatedCollabWorks));
        console.log(collabWorks.token);
        localStorage.setItem("Name", updatedCollabWorks.name);
        localStorage.setItem("Token", updatedCollabWorks.token);
        localStorage.setItem("Role", updatedCollabWorks.role);
        setUserDetails({
          mail: "",
          uid: "",
          name: "",
          password: "",
          role: "",
          token: "",
        });
        var guid = response.data.uid;
        closeModal();
        navigate(`/projects/${guid}`);
      }
    } catch (error: any) {
      console.error("Login error", error);
      console.log("Login Toast");
      if (error.response.status === 500)
        addToast("Please check your credentials", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
    }
  };

  const validateForm = () => {
    const { mail, password } = userDetails;
    setIsFormValid(mail.trim() !== "" && password.trim() !== "");
  };

  useEffect(() => {
    validateForm();
  }, [userDetails]);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="login-modal"
      >
        <div className="login-body">
          <img src={LoginPage} alt="Login" className="login-image" />
          <div className="login-container">
            <form onSubmit={handleLoginSubmit}>
              <h4 style={{ textAlign: "center" }}>Login</h4>
              <div className="login-close-div">
                <p className="login-close-button" onClick={closeModal}>
                  <b>X</b>
                </p>
              </div>
              <label className="login-lable">Mail:</label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={userDetails.mail}
                onChange={handleChange}
                className="login-input"
              ></input>
              <br />
              <label className="login-lable">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                className="login-input"
              ></input>
              <br />
              <button
                className={`login-button ${isFormValid ? "" : "disabled"}`}
                type="submit"
                disabled={!isFormValid}
              >
                Login
              </button>
              <br />
              <a
                className="login-registerButton"
                onClick={() => {
                  openRegisterModal
                    ? openRegisterModal()
                    : openRegisterModalLocal();
                  closeModal(); // Close the login modal
                }}
              >
                Click here to register
              </a>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserLogin;
