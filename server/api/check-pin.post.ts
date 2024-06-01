import { defineEventHandler, readBody } from "h3";
import { PIN } from "../../constants/app";

export default defineEventHandler(async (event) => {
  const pin = (await readBody(event))?.pin;
  if (!pin || typeof pin !== "string" || PIN.includes(pin)) {
    setResponseStatus(event, 400);
    return { message: "PIN is required or Invalid PIN" };
  }
  return { isUnique: !PIN.includes(pin) };
});
