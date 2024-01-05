import { d as db, u as usersToProjects, f as featureFlag } from "../../../../../../../chunks/index3.js";
import { e as error, r as redirect } from "../../../../../../../chunks/index.js";
import { and, eq } from "drizzle-orm";
const load = async ({ locals, params }) => {
  const { projectId, flagId } = params;
  const session = await locals.auth.validate();
  const membership = await db.query.usersToProjects.findFirst({
    where: and(
      eq(usersToProjects.userId, session.user.userId),
      eq(usersToProjects.projectId, projectId)
    ),
    with: { project: { with: { featureFlags: true } } }
  });
  if (!membership)
    return error(400);
  const flag = membership.project.featureFlags.find((flag2) => flag2.id === flagId);
  return {
    flag
  };
};
const actions = {
  default: async ({ request, locals, params }) => {
    const { projectId, flagId } = params;
    const session = await locals.auth.validate();
    const membership = await db.query.usersToProjects.findFirst({
      where: and(
        eq(usersToProjects.userId, session.user.userId),
        eq(usersToProjects.projectId, projectId)
      )
    });
    if (!membership)
      return error(400);
    const formData = await request.formData();
    const name = formData.get("name")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    await db.update(featureFlag).set({
      name,
      description
    }).where(eq(featureFlag.id, flagId));
    redirect(302, `/projects/${projectId}/flags`);
  }
};
export {
  actions,
  load
};
