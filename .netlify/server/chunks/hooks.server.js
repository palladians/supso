import { a as auth } from "./index4.js";
const handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};
export {
  handle
};
