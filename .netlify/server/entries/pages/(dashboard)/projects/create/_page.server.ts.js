import { d as db, p as project, u as usersToProjects } from "../../../../../chunks/index3.js";
import { r as redirect } from "../../../../../chunks/index.js";
const actions = {
  default: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    const formData = await request.formData();
    const name = formData.get("name")?.toString() ?? "";
    const createdProject = await db.transaction(async (tx) => {
      const [createdProject2] = await tx.insert(project).values({
        name,
        ownerId: session.user.userId
      }).returning();
      await tx.insert(usersToProjects).values({
        userId: session.user.userId,
        projectId: createdProject2.id,
        role: "admin"
      });
      return createdProject2;
    });
    redirect(302, `/projects/${createdProject.id}`);
  }
};
export {
  actions
};
