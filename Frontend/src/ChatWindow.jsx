import React, { useContext, useEffect, useState, useRef } from "react";
import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext.jsx";
import { PacmanLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";


function ChatWindow() {
  const {
    prompt,
    setPrompt,
    currThreadId,
    setNewChat,
    setPrevChats,
    setReply,
    loggedInUsername,
    setLoggedInUsername,
    authorizedUser,
    setAuthorizedUser,
    privateChat,
    setPrivateChat,
    showPrivatePopup,
    setShowPrivatePopup
  } = useContext(MyContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDroppedDownOpen, setIsDroppedDownOpen] = useState(false);
  const [changeTheme, setChangeTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [loading, setPrevChats]);

  // Apply theme on mount
  useEffect(() => {
    document.body.className = changeTheme;
  }, [changeTheme]);

  // Verify user token on mount
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`https://sanjitgpt-backend-1.onrender.com/api/verify`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setAuthorizedUser(data.user);
          setLoggedInUsername(data.user.username);
        
        }
      } catch (err) {
        console.error("Verify Error:", err);
      }
    };
    verifyUser();
  }, [setAuthorizedUser, setLoggedInUsername]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.lang = "en-US";
    recognition.current.interimResults = false;

    recognition.current.onstart = () => setListening(true);
    recognition.current.onend = () => setListening(false);
    recognition.current.onresult = (event) => {
      setPrompt(event.results[0][0].transcript);
    };
  }, []);

  const startListening = () => {
    if (!recognition.current) return;
    window.speechSynthesis.cancel();
    recognition.current.abort();
    recognition.current.start();
  };

  const getReply = async () => {
    if (!prompt.trim()) return;
  
    setPrevChats((prev) => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);
    setNewChat(false);
  
    try {
      //Asking SanjitGPT
      const response = await fetch("https://sanjitgpt-backend-1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
          userId: authorizedUser?._id,
          privateChat,
        }),
      });
  
      const rep = await response.json();
      const r = rep.reply;
  
      setPrevChats((prev) => [...prev, { role: "assistant", content: r }]);
      setReply(r);
  
      const utterance = new SpeechSynthesisUtterance(r);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
  
    } catch (err) {
      console.error("Frontend Error:", err);
  
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: "Network error! Could not get a reply." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleProfileClick = () => setIsDroppedDownOpen(!isDroppedDownOpen);

  const handleLogout = async () => {
    try {
      await fetch("https://sanjitgpt-backend-1.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthorizedUser({});
      setLoggedInUsername("");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = changeTheme === "dark" ? "light" : "dark";
    setChangeTheme(newTheme);
    localStorage.setItem("theme", newTheme); // persist theme
    document.body.className = newTheme;
  };

  const handlePrivateChatSwitch = () => {
    if (!privateChat) {
      setShowPrivatePopup(true);
    } else {
      setNewChat(true);
      setPrevChats([]);
      setPrivateChat(false);
    }
  };

  const handleContinue = () => {
    setPrevChats([]);
    setNewChat(true);
    setShowPrivatePopup(false);
    setPrivateChat(true);
  };

  return (
    <div className={`chatWindow ${changeTheme}`}>
      {/* Navbar */}
      <div className="navbar">
        <select className="modelSelect">
          <option value="sanjit-gpt">SanjitGPT &nbsp;v1.0</option>
        </select>

        <div className="userIconDiv">
          {!loggedInUsername && (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button>Login</button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button>Signup</button>
              </Link>
            </>
          )}
          {loggedInUsername && (
            <>
              <i
                className="fa-solid fa-user-tie"
                onClick={handleProfileClick}
              ></i>
              <span className="private">
                {privateChat ? (
                  <i
                    className="fa-solid fa-lock-open"
                    onClick={handlePrivateChatSwitch}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-lock"
                    onClick={handlePrivateChatSwitch}
                  ></i>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isDroppedDownOpen && (
        <div className="dropDown">
          <div className="sayHello">Hello, {loggedInUsername}</div>
          <Link to="/sanjitgpt/account" style={{ textDecoration: "none" }}>
            <div className="dropDownItem">
              Account <i className="fa-regular fa-user"></i>
            </div>
          </Link>
          <div className="dropDownItem" onClick={toggleTheme}>
            {changeTheme === "dark" ? (
              <>
                Light Mode <i className="fa-solid fa-sun"></i>
              </>
            ) : (
              <>
                Dark Mode <i className="fa-solid fa-moon"></i>
              </>
            )}
          </div>
          {loggedInUsername && (
            <div className="dropDownItem" onClick={handleLogout}>
              Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
          )}
        </div>
      )}

      {/* Chat container */}
      <div className="chatContainer">
        {showPrivatePopup && (
          <div className="popupOverlay">
            <div className="popupBox">
              <h2>Private Chat</h2>
              <p>
                You’re switching to a private conversation mode. Messages here
                won’t be stored in history.
              </p>
              <button className="continueBtn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="messagesArea">
          <Chat />
          <div ref={messagesEndRef}></div>
        </div>
        <PacmanLoader loading={loading} color="#fff" />
      </div>

      {/* Input */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="mic" onClick={startListening}>
            <i className={`fa-solid fa-microphone ${listening ? "listening" : ""}`}></i>
          </div>
          <div id="submit" onClick={getReply}>
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <div className="info">
          <p>
            SanjitGPT can make mistakes. Check important info. <u>See Cookie Preferences</u>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
