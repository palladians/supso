import { d as db, u as usersToProjects, f as featureFlag } from "../../../../../../../chunks/index3.js";
import { e as error, r as redirect } from "../../../../../../../chunks/index.js";
import { and, eq } from "drizzle-orm";
const actions = {
  default: async ({ request, locals, params }) => {
    const { projectId } = params;
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
    await db.insert(featureFlag).values({
      name,
      description,
      projectId
    });
    redirect(302, `/projects/${projectId}/flags`);
  }
};
export {
  actions
};
