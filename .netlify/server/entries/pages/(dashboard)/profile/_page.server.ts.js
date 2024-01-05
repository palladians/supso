import { d as db, a as accessToken, c as user } from "../../../../chunks/index3.js";
import { eq, and } from "drizzle-orm";
import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  const accessTokens = await db.query.accessToken.findMany({
    where: eq(accessToken.userId, session.user.userId)
  });
  return {
    accessTokens
  };
};
const actions = {
  updateProfile: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    const formData = await request.formData();
    const username = formData.get("username")?.toString() ?? "";
    await db.update(user).set({
      username
    }).where(eq(user.id, session.user.userId));
    return redirect(302, "/profile");
  },
  createToken: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    const formData = await request.formData();
    const tokenName = formData.get("name")?.toString() ?? "";
    await db.insert(accessToken).values({
      name: tokenName,
      userId: session.user.userId
    });
    return redirect(302, "/profile");
  },
  deleteToken: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    const formData = await request.formData();
    const id = formData.get("id")?.toString() ?? "";
    await db.delete(accessToken).where(and(eq(accessToken.id, id), eq(accessToken.userId, session.user.userId)));
    return redirect(302, "/profile");
  }
};
export {
  actions,
  load
};
