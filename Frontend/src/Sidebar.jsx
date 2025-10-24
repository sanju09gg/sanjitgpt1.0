import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setPrevChats,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    authorizedUser,
    loggedInUsername,
    setPrivateChat
  } = useContext(MyContext);
  const [toggleSidebar, setToggleSidebar] = useState(true);

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
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const closeSidebar = () => {
    setToggleSidebar(!toggleSidebar);
  };

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setPrivateChat(false);

    try {
      const res = await fetch(
        `https://sanjitgpt-backend-1.onrender.com/${newThreadId}`
      );
      const response = await res.json();
      setPrevChats(response);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://sanjitgpt-backend-1.onrender.com/${threadId}`,
        { method: "DELETE" }
      );
      await response.json();
      console.log("Thread deleted successfully.");
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {toggleSidebar ? (
      <section className="sidebar">
      <div className="topbar">
        <img
          src="src/assets/blacklogo.png"
          alt="gpt_logo"
          className="logo"
        />
        <i className="fa-solid fa-xmark" onClick={closeSidebar}></i>
      </div>
    
      <button onClick={createNewChat}>
        <span>New Chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>
    

      <div className="threadContainer">
        <ul className="threads">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>
      </div>
    
  
      <div className="account" onClick={closeSidebar}>
        <div className="avatar">
          {loggedInUsername ? loggedInUsername.slice(0, 2).toUpperCase() : "??"}
        </div>
        <div className="username">
          {loggedInUsername
            ? loggedInUsername.charAt(0).toUpperCase() + loggedInUsername.slice(1)
            : ""}
        </div>
      </div>
    </section>
    
      ) : (
        <div className="panel">
          <i className="fa-solid fa-table-columns" onClick={closeSidebar}></i>{" "}
          <br />{" "}
          <i className="fa-solid fa-pen-to-square" onClick={createNewChat}></i>
        </div>
      )}
    </>
  );
}

export default Sidebar;
