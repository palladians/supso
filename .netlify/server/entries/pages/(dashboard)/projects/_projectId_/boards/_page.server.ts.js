import { d as db, u as usersToProjects } from "../../../../../../chunks/index3.js";
import { and, eq } from "drizzle-orm";
import { e as error } from "../../../../../../chunks/index.js";
const load = async ({ locals, params }) => {
  const { projectId } = params;
  const session = await locals.auth.validate();
  const project = await db.query.usersToProjects.findFirst({
    where: and(
      eq(usersToProjects.userId, session.user.userId),
      eq(usersToProjects.projectId, projectId)
    ),
    with: { project: { with: { boards: true } } }
  });
  if (!project)
    return error(404);
  const boards = project.project.boards;
  return {
    boards
  };
};
export {
  load
};
