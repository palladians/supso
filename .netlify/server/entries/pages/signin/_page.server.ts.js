import { d as db, v as verificationCode, c as user } from "../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { r as redirect } from "../../../chunks/index.js";
const SECRET_PLUNK_API_KEY = "sk_67e7dec821c89713c10a2474e061a0f0063e76e78d296702";
const PUBLIC_APP_URL = "http://localhost:5173";
const ensureUser = async ({ email }) => {
  const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (existingUser)
    return existingUser;
  const [newUser] = await db.insert(user).values({
    email,
    username: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals]
    })
  }).returning();
  return newUser;
};
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session)
    throw redirect(302, "/projects");
};
const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString() ?? "";
    const existingUser = await ensureUser({ email });
    await db.delete(verificationCode).where(eq(verificationCode.userId, existingUser.id));
    const [code] = await db.insert(verificationCode).values({
      userId: existingUser.id,
      expires: Date.now() + 1e3 * 60 * 5
    }).returning();
    const emailRequest = await fetch("https://api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SECRET_PLUNK_API_KEY}`
      },
      body: JSON.stringify({
        to: email,
        subject: "Sign in to Supso",
        body: `Sign in: ${PUBLIC_APP_URL}/verify?token=${code.id}`
      })
    });
    const response = await emailRequest.json();
    if (!response.success)
      return redirect(302, "/signin?error=true");
    return redirect(302, "/signin?success=true");
  }
};
export {
  actions,
  load
};
