import React,{useState,useContext} from "react";
import "./Login.css";
import { Link,useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { setLoggedInUsername, setAuthorizedUser,setNewChat, setPrevChats } =
    useContext(MyContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault(); 
  
    try {
      const res = await fetch("http://localhost:4040/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });
  
    const data = await res.json();
    if(!data.success){
      return alert(data.message);
    }
     setNewChat(true);
     setPrevChats([]);
     setAuthorizedUser(data.user);
     setLoggedInUsername(data.user.username);
     alert(`Welcome Back ${data.user.username}`);
  
     navigate("/sanjitgpt");
   
    } catch (err) {
     console.log(err);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to your account</p>

        <form method="post" onSubmit={handleLoginFormSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn">
            Continue
          </button>
        </form>

        <p className="footer-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
