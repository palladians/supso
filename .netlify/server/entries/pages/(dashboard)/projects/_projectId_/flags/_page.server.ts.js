import { d as db, u as usersToProjects, f as featureFlag } from "../../../../../../chunks/index3.js";
import { and, eq } from "drizzle-orm";
import { e as error, r as redirect } from "../../../../../../chunks/index.js";
const actions = {
  toggleFlag: async ({ request, locals, params }) => {
    const { projectId } = params;
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
    const formData = await request.formData();
    const flagId = formData.get("flagId")?.toString() ?? "";
    const flag = membership.project.featureFlags.find((flag2) => flag2.id === flagId);
    if (!flag)
      return error(404);
    const enabled = flag.enabled === "true";
    await db.update(featureFlag).set({
      enabled: String(!enabled)
    }).where(eq(featureFlag.id, flag.id));
    redirect(302, `/projects/${projectId}/flags`);
  },
  deleteFlag: async ({ request, locals, params }) => {
    const { projectId } = params;
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
    const formData = await request.formData();
    const flagId = formData.get("id")?.toString() ?? "";
    await db.delete(featureFlag).where(and(eq(featureFlag.id, flagId), eq(featureFlag.projectId, projectId)));
    redirect(302, `/projects/${projectId}/flags`);
  }
};
const load = async ({ locals, params }) => {
  const { projectId } = params;
  const session = await locals.auth.validate();
  const project = await db.query.usersToProjects.findFirst({
    where: and(
      eq(usersToProjects.userId, session.user.userId),
      eq(usersToProjects.projectId, projectId)
    ),
    with: { project: { with: { featureFlags: true } } }
  });
  if (!project)
    return error(404);
  const featureFlags = project.project.featureFlags;
  return {
    featureFlags
  };
};
export {
  actions,
  load
};
