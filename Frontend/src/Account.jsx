import React, { useContext } from "react";
import "./Account.css";
import { MyContext } from "./MyContext";
import { Link } from "react-router-dom";

function Account() {
  const { authorizedUser } = useContext(MyContext);

  return (
    <div className="account-page">
      {/* 🔙 Back Button */}
      <Link to="/sanjitgpt" className="back-button">
        <i className="fa-solid fa-arrow-left"></i> Back
      </Link>

      <div className="account-card">
        <h1 className="account-title">Your Account</h1>

        <div className="account-info">
          <div className="account-item">
            <span className="label">Username</span>
            <span className="value">
              {authorizedUser?.username || "Not available"}
            </span>
          </div>

          <div className="account-item">
            <span className="label">Email</span>
            <span className="value">
              {authorizedUser?.email
                ? authorizedUser.email.length > 20
                  ? authorizedUser.email.slice(0, 20) + "…"
                  : authorizedUser.email
                : "Not available"}
            </span>
          </div>
        </div>

        <div className="account-footer">
          <p>This is your SanjitGPT account information.</p>
        </div>

        <br />
        <center>
          <p className="version-text">SanjitGPT v1.0</p>
        </center>
      </div>
    </div>
  );
}

export default Account;
