import React,{useContext} from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import { MyContext } from "./MyContext.jsx";
import ChatWindow from "./ChatWindow.jsx";

function App() {
    const {loggedInUsername  } =
    useContext(MyContext);
    
  // if (loading) return <div>Loading...</div>; // wait until verify finishes

  return (
    <div className="app">
    
    {(loggedInUsername && loggedInUsername.length !== 0) && (
       <Sidebar/>
      )}
        <ChatWindow />
    </div>
  );
}

export default App;
