import "dotenv/config";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY =  process.env.GEMINI_KEY; // your key
const genAI = new GoogleGenerativeAI(API_KEY);

const getOpenAPIAIResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("SanjitGPT API error:", error);
    // fallback replies if failure
    const fallbackReplies = [
      "Interesting, tell me more.",
      "Can you explain that?",
      "I see. What else?",
      "Hmm, that’s curious.",
      "Go on..."
    ];
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }
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