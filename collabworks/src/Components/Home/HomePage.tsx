import React, { useState, useEffect } from "react";
import NavBar from "../Navbar/Navbar";
import "./HomePage.css";
import CollabWorkService from "../../Services/CollabWorkService";
import { HomePageImage } from "../../Model/HomePageImage";

const HomePage = () => {
  const [homePageImages, setHomePageImages] = useState<HomePageImage[]>([]);

  const getAllHomePageImages = async () => {
    try {
      const response = await CollabWorkService.GetAllHomePageImages();
      if (response.status === 200 || response.status === 201) {
        setHomePageImages(response.data);
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllHomePageImages();
  }, []);

  return (
    <>
      <div className="homePage-mainDiv">
        <header>
          <NavBar />
        </header>
        <main className="main-container">
          <div className="content">
            <p>
              <b>Collab Works</b> is an innovative project management platform
              designed to streamline collaboration and productivity among teams.
              With an interface reminiscent of the highly acclaimed ADO board,
              Collab Works offers a user-friendly and visually engaging
              environment where teams can organize tasks, track progress, and
              foster seamless communication.
              <br />
              <br /> This platform empowers users to create customizable boards,
              allowing for the easy organization of projects, tasks, and
              workflows. Users can effortlessly drag and drop items, set
              priorities, assign tasks to team members, and visualize progress
              through intuitive boards and cards. Collab Works integrates
              advanced features such as real-time updates, interactive chat
              functionalities, file sharing, and deadline reminders, fostering a
              cohesive work environment and enhancing team coordination. Whether
              utilized by small teams or large enterprises, Collab Works
              provides a versatile, efficient, and collaborative space, enabling
              teams to achieve their goals with precision and agility.
            </p>
          </div>
          {homePageImages.length > 0 && (
            <div className="image">
              {homePageImages[0].name && (
                <img
                  src={require(`./Assets/${homePageImages[0].name}`)}
                  alt="HomePageImage"
                  className="homePage-image"
                />
              )}
            </div>
          )}
        </main>
        <div className="benefit">
          <h3 className="benefit-title">Benefits of using Collab Works</h3>
        </div>
        {homePageImages.length > 1 && (
          <div className="top-images">
            <div className="image-grid">
              {homePageImages &&
                homePageImages.slice(1).map((image, index) => (
                  <div key={image.uid} className="image-item">
                    <img
                      src={require(`./Assets/${image.name}`)}
                      alt={`benefitImage-${index}`}
                      className="grid-image"
                    />
                    <div className="image-caption">
                      <b>{image.caption && <p>{image.caption}</p>}</b>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <span>
        <footer className="text-center bg-body-tertiary">
          <div
            className="text-center p-3"
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            © 2024 Copyright{"    "}: &nbsp;CollabWorks.com
          </div>
        </footer>
      </span>
    </>
  );
};

export default HomePage;
