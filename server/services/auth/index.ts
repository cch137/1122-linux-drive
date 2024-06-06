import fs from "fs";
import path from "path";
import { filesDirPath } from "../constants";
import random from "@cch137/utils/random/index.js";

const auth = {
  isPin(pin: any): pin is string {
    if (typeof pin !== "string" || !pin) return false;
    const userDirname = path.join(filesDirPath, pin);
    if (!fs.existsSync(userDirname)) return false;
    return fs.statSync(userDirname).isDirectory();
  },
  generatePin() {
    let i = 3;
    while (i--) {
      const pin = random.base16(10).toUpperCase();
      if (auth.isPin(pin)) continue;
      const userDirname = path.join(filesDirPath, pin);
      console.log(`Creating directory at: ${userDirname}`);
      try {
        fs.mkdirSync(userDirname, { recursive: true });
        console.log(`Successfully created directory at: ${userDirname}`);
        return pin;
      } catch (error) {
        console.error(`Error creating directory at: ${userDirname}`, error);
        throw error;
      }
    }
    throw new Error("Failed to generate pin");
  },
};

export default auth;
