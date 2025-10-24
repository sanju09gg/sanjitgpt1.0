import fetch from "node-fetch";
import "dotenv/config";

const getOpenAPIAIResponse = async (message) => {
  const fallbackReplies = [
    "Interesting, tell me more.",
    "Can you explain that?",
    "I see. What else?",
    "Hmm, that’s curious.",
    "Go on..."
  ];
  // Return a random reply
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
};

export default getOpenAPIAIResponse;


// import "dotenv/config";

// const getOpenAPIAIResponse = async(res,message)=>{
//   //     const options = {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //     "Authorization": `Bearer ${process.env.OPENAI_ADMIN_KEY}`, 
//   //   },
//   //   body: JSON.stringify({
//   //     model: "gpt-4o-mini",
//   //     messages: [

//   //       { role: "user", content: message }
//   //     ]
//   //   }),
//   // };

//   try {
//     // const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", options);
//     // const data = await apiResponse.json();
//     // if (data.error) throw new Error(data.error.message);
//     return "Hello! what's on your mind today?"; // send back to client
//   } catch (err) {
//     console.error("OpenAI error:", err);
//    throw err;
//   }
// }

// export default getOpenAPIAIResponse;