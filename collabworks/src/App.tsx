import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RegisterUser from "./Components/Register/RegisterUser";
import UserLogin from "./Components/Login/UserLogin";
import GetProjects from "./Components/Projects/GetProjects";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import FetchWorkItem from "./Components/WorkItem/FetchWorkItem/FetchWorkItem";
import WorkItemDetails from "./Components/WorkItem/WorkItemDetails/WorkItemDetails";
import AddWorkItem from "./Components/WorkItem/AddWorkItem/AddWorkItem";
import GetSprintDetails from "./Components/Sprint/GetSprintDetails/GetSprintDetails";
import AddSprint from "./Components/Sprint/AddSprint/AddSprint";
import { useSelector } from "react-redux";
import { StateModel } from "./State/StateModel";
import { Navigate } from "react-router-dom";
import NavBar from "./Components/Navbar/Navbar";
import HomePage from "./Components/Home/HomePage";
import { useToasts } from "react-toast-notifications";
import AddWorkItems from "./Components/WorkItem/AddWorkItem/AddWorkItems";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoute";
import { WorkItem } from "./Model/WorkItem";
import { Sprint } from "./Model/Sprint";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/userLogin"
            element={
              <ProtectedRoutes>
                <UserLogin
                  closeModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  openRegisterModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoutes>
                <RegisterUser
                  closeModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/projects/:guid"
            element={
              <ProtectedRoutes>
                <GetProjects />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/fetchWorkItem"
            element={
              <ProtectedRoutes>
                {" "}
                <FetchWorkItem />{" "}
              </ProtectedRoutes>
            }
          />
          <Route
            path="/workItemDetails/:workItemUID"
            element={
              <ProtectedRoutes>
                {" "}
                <WorkItemDetails />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/addWorkItem"
            element={
              <ProtectedRoutes>
                <AddWorkItem
                  closeModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/sprintDetails"
            element={
              <ProtectedRoutes>
                <GetSprintDetails />{" "}
              </ProtectedRoutes>
            }
          />
          <Route
            path="/addSprint"
            element={
              <ProtectedRoutes>
                <AddSprint
                  closeModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  updateSprintDetails={function (newSprint: Sprint): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/navbar"
            element={
              <ProtectedRoutes>
                {" "}
                <NavBar />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/addWorkItems"
            element={
              <ProtectedRoutes>
                <AddWorkItems
                  closeModal={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  onAdd={function (workItemUID: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
