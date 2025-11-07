import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import App from "./App.jsx";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import Account from "./Account.jsx";

// Create a provider component to hold global state
function MyContextProvider({ children }) {
  const [authorizedUser, setAuthorizedUser] = useState({});
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prevChats, setPrevChats] = useState([]);
  const [allThreads, setAllThreads] = useState([]);
  const [privateChat, setPrivateChat] = useState(false);
  const [showPrivatePopup, setShowPrivatePopup] = useState(false);

  // ✅ Verify JWT token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("https://sanjitgpt-backend-1.onrender.com/api/verify", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setAuthorizedUser(data.user);
          setLoggedInUsername(data.user.username);
          console.log("✅ User verified:", data.user.username);
        } else {
          console.log("Token not valid or expired");
        }
      } catch (err) {
        console.error("Verify Error:", err);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);


  const getAllThreads = async () => {
    try {
      const res = await fetch(`https://sanjitgpt-backend-1.onrender.com/api/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authorizedUser.id }),
      });

      const response = await res.json();
      const filteredData = response.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log("❌ Error fetching threads:", err);
    }
  };

  const providerValues = {
    loggedInUsername,
    setLoggedInUsername,
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    getAllThreads,
    authorizedUser,
    setAuthorizedUser,
    privateChat,
    setPrivateChat,
    showPrivatePopup,
    setShowPrivatePopup,
    loading,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <MyContext.Provider value={providerValues}>
      {children}
    </MyContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MyContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sanjitgpt" element={<App />} />
          <Route path="/sanjitgpt/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MyContextProvider>
  </React.StrictMode>
);
