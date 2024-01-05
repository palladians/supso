import { d as db, v as verificationCode } from "../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { a as auth } from "../../../chunks/index4.js";
import { e as error, r as redirect } from "../../../chunks/index.js";
const GET = async ({ url, cookies }) => {
  const token = url.searchParams.get("token") ?? "";
  const verification = await db.query.verificationCode.findFirst({
    where: eq(verificationCode.id, token)
  });
  if (!verification)
    return error(401, "Invalid token!");
  const session = await auth.createSession({
    userId: verification.userId,
    attributes: {}
  });
  const sessionCookie = auth.createSessionCookie(session);
  cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  redirect(302, "/projects");
};
export {
  GET
};
