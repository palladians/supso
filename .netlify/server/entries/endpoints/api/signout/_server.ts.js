import { a as auth } from "../../../../chunks/index4.js";
import { r as redirect } from "../../../../chunks/index.js";
const POST = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session)
    return Response.json({ ok: true });
  await auth.invalidateAllUserSessions(session.user.userId);
  return redirect(302, "/signin");
};
export {
  POST
};
