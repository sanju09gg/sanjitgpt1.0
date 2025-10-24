import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
 
    // 1️⃣ Get token from cookie or Authorization header
    const token =
      req.cookies?.token
      // If req.cookies is undefined (for any reason), it won’t throw an error — it’ll just return undefined.
     
      // console.log("Token: ",token);

    if (!token) return res.status(401).json({ error: "Access denied. No token." });

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
   
    // 3️⃣ Attach user info to req object
    req.user = decoded;
 

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
