import { d as db, u as usersToProjects, b as board } from "../../../../../../../chunks/index3.js";
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
    const tag = formData.get("tag")?.toString() ?? "";
    const tagValues = formData.get("tagValues")?.toString() ?? "";
    const tagValuesArray = tagValues.split(",");
    await db.insert(board).values({
      name,
      tag,
      options: tagValuesArray,
      projectId
    });
    redirect(302, `/projects/${projectId}/boards`);
  }
};
export {
  actions
};
