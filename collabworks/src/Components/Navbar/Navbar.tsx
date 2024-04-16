import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StateModel } from "../../State/StateModel";
import { FaBars } from "react-icons/fa";
import "./Navbar.css";
import UserLogin from "../Login/UserLogin";
import RegisterUser from "../Register/RegisterUser";
import { setLogOut } from "../../State/ActionCreators";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userDetails = useSelector((state: StateModel) => state);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const localName = localStorage.getItem("Name");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const currentLocation = location.pathname;
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLogin = () => {
    navigate("/userLogin");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    dispatch(setLogOut());
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (userDetails.token !== "" || token !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userDetails]);

  return (
    <div>
      <Navbar bg="transparent " variant="light" className="navbar-border">
        <Container fluid>
          <Navbar.Brand>
            {currentLocation !== "/" ? (
              <div
                className="navbar-hamburger"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <FaBars />
              </div>
            ) : null}
            <i className="bi bi-list text-primary"></i>
            <div className="navbar-title">
              <b>Collab Works</b>
            </div>
          </Navbar.Brand>
          <div className={`sidebar ${showSidebar ? "show" : ""}`}>
            <Nav className="flex-column">
              {isLoggedIn ? (
                <>
                  <Nav.Link
                    onClick={() => navigate("/sprintDetails")}
                    className={
                      currentLocation === "/sprintDetails" ? "currentPage" : ""
                    }
                  >
                    Sprint Details
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/fetchWorkItem ")}
                    className={
                      currentLocation === "/fetchWorkItems" ? "currentPage" : ""
                    }
                  >
                    Work Items
                  </Nav.Link>
                </>
              ) : null}
            </Nav>
          </div>
          <div className="navbar-details">
            <div className="navbar-userInfo">
              {userDetails.name !== "" || localName !== null ? (
                <Nav.Link>Hi {userDetails.name || localName}</Nav.Link>
              ) : null}
            </div>
            <div className="navbar-logButton logButton">
              {isLoggedIn === true ? (
                <Nav.Link style={{ marginTop: "-1px" }} onClick={handleLogout}>
                  Logout
                </Nav.Link>
              ) : (
                <span>
                  <Nav.Link
                    style={{ marginTop: "-1px" }}
                    onClick={() => {
                      openLoginModal();
                      setShowSidebar(false);
                    }}
                  >
                    Login
                  </Nav.Link>
                  {isLoginModalOpen && (
                    <UserLogin
                      closeModal={closeLoginModal}
                      openRegisterModal={openRegisterModal}
                    />
                  )}
                  {isRegisterModalOpen && (
                    <RegisterUser closeModal={closeRegisterModal} />
                  )}
                </span>
              )}
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
