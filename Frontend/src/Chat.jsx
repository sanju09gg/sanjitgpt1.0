import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import RehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply, privateChat } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" "); //individual words array
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);
  return (
    <>
      {newChat && (
        <div className="chatHeader">
          <h1>{privateChat ? "Temporary chat" : "Start a new chat"}</h1>
          <br />
          {privateChat && (
            <p className="tempChatMsg" style={{ lineHeight: "1.9" }}>
              This chat won’t be saved or appear in your history. SanjitGPT
              doesn’t store or train on private conversations. For testing
              purposes only — no data is permanently kept.
            </p>
          )}
        </div>
      )}

      <div className="chats">
        {prevChats?.slice(0, -1).map(
          (
            chat,
            idx //exclude last index
          ) => (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <p className="gptMessage">
                  <ReactMarkdown rehypePlugins={[RehypeHighlight]}>
                    {chat.content}
                  </ReactMarkdown>
                </p>
              )}
            </div>
          )
        )}
        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key="typing">
                <p className="gptMessage">
                  <ReactMarkdown rehypePlugins={[RehypeHighlight]}>
                    {prevChats[prevChats.length - 1].content}
                  </ReactMarkdown>
                </p>
              </div>
            ) : (
              <div className="gptDiv" key="typing">
                <p className="gptMessage">
                  <ReactMarkdown rehypePlugins={[RehypeHighlight]}>
                    {latestReply}
                  </ReactMarkdown>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Chat;
