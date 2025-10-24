import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="landing">
      <div className="landing-box">
        <h1>Continue Your Journey with SanjitGPT</h1>
        <p className="subtitle">
          Your AI assistant is ready to help you explore, learn, and create.
        </p>

        <Link to="/sanjitgpt" className="cta-btn">
          Continue Your Journey
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
