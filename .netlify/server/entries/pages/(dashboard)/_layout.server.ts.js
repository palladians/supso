import { r as redirect } from "../../../chunks/index.js";
import { d as db, u as usersToProjects } from "../../../chunks/index3.js";
import { eq } from "drizzle-orm";
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session)
    throw redirect(302, "/signin");
  const projects = (await db.query.usersToProjects.findMany({
    where: eq(usersToProjects.userId, session.user.userId),
    with: { project: true }
  })).map((userToProject) => userToProject.project);
  return {
    user: session.user,
    projects
  };
};
export {
  load
};
