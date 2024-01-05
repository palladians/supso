import { lucia } from "lucia";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { s as sqlite } from "./index3.js";
import { sveltekit } from "lucia/middleware";
const auth = lucia({
  adapter: betterSqlite3(sqlite, {
    user: "user",
    key: "user_key",
    session: "user_session"
  }),
  env: "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      username: data.username
    };
  }
});
export {
  auth as a
};
