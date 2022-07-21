import React from "react";

const Intro = ({setIsplaying}) => {
  const play = () => {
    setIsplaying(true);
  }
  return (
    <div className="intro-wrapper">
      <div className="hello-world">
        <h1>Hello World</h1>
      </div>
      <div className="welcome">
        <p>Welcome to Edgar Allan’s magical clubhouse studio built with Three.js in Webflow. Explore our world and collect some of our favorite things!</p>
      </div>
      <div className="start">
        <a href="#" className="button" onClick={play}>
          <span>Start Playing</span>
          <img src="images/arrow.svg"/>
        </a>
      </div>
    </div>
  )
}

export default Intro;