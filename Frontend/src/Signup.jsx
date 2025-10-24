import React, { useContext, useState } from "react";
import "./Signup.css";
import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext.jsx";

function Signup() {

  const navigate = useNavigate();

  const { setLoggedInUsername, setAuthorizedUser, setNewChat, setPrevChats } =
    useContext(MyContext);


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
  
    try {
      const res = await fetch("https://sanjitgpt-backend-1.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send cookies
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await res.json();
      setNewChat(true);
      setPrevChats([]);
     setAuthorizedUser(data.user);
     setLoggedInUsername(data.user.username);
     alert(`Welcome ${data.user.username}`);
     
     navigate("/sanjitgpt");
   
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup">
      <div className="signup-box">
        <h2>Welcome to ChatGPT</h2>
        <p className="subtitle">Sign up to get started</p>
        <form method="post" onSubmit={handleFormSubmit}>
        <input
            type="text"
            placeholder="Create an username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
           <input
            type="password"
            placeholder="Create a password"
            className="input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn">
            Continue
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>

        </p>
      </div>
    </div>
  );
}

export default Signup;
