// generation of a token

// utils/SecretToken.js
import "dotenv/config";
import jwt from "jsonwebtoken";

export const createSecretToken = (id) => {

  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: "3d", 
  });
};