import { d as db, p as project } from "../../../../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { e as error } from "../../../../../../chunks/index.js";
const actions = {
  toggleFlag: async ({ request, locals, params }) => {
  }
};
const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  const project$1 = await db.query.project.findFirst({
    where: eq(project.id, params.projectId),
    with: { usersToProjects: { with: { user: true } } }
  });
  if (!project$1)
    return error(404);
  const permitted = project$1.usersToProjects.some(
    (userToProject) => userToProject.userId === session.user.userId
  );
  if (!permitted)
    return error(400);
  const members = project$1.usersToProjects;
  const membersOptions = members.map((userToProject) => userToProject.user).map((member) => ({
    label: member.username,
    value: member.id
  }));
  return { project: project$1, members, membersOptions };
};
export {
  actions,
  load
};
