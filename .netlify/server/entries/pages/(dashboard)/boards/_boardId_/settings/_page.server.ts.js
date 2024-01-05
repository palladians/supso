import { d as db, b as board } from "../../../../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { e as error, r as redirect } from "../../../../../../chunks/index.js";
const actions = {
  updateBoard: async ({ request, locals, params }) => {
    const { boardId } = params;
    const session = await locals.auth.validate();
    const board$1 = await db.query.board.findFirst({
      where: eq(board.id, boardId),
      with: {
        project: {
          with: {
            usersToProjects: true
          }
        }
      }
    });
    if (!board$1)
      return error(404);
    const permitted = board$1.project.usersToProjects.some(
      (userToProject) => userToProject.userId === session.user.userId
    );
    if (!permitted)
      return error(400);
    const formData = await request.formData();
    const name = formData.get("name")?.toString() ?? "";
    const tag = formData.get("tag")?.toString() ?? "";
    const tagValues = formData.get("tagValues")?.toString() ?? "";
    const tagValuesArray = tagValues.split(",");
    await db.update(board).set({
      name,
      tag,
      options: tagValuesArray
    }).where(eq(board.id, boardId));
    redirect(302, `/boards/${boardId}/settings`);
  },
  deleteBoard: async ({ request, locals, params }) => {
    const { boardId } = params;
    const session = await locals.auth.validate();
    const board$1 = await db.query.board.findFirst({
      where: eq(board.id, boardId),
      with: {
        project: {
          with: {
            usersToProjects: true
          }
        }
      }
    });
    if (!board$1)
      return error(404);
    const permitted = board$1.project.usersToProjects.some(
      (userToProject) => userToProject.userId === session.user.userId
    );
    if (!permitted)
      return error(400);
    const formData = await request.formData();
    const id = formData.get("id")?.toString() ?? "";
    await db.delete(board).where(eq(board.id, id));
    redirect(302, `/projects/${board$1.project.id}/boards`);
  }
};
const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  const board$1 = await db.query.board.findFirst({
    where: eq(board.id, params.boardId),
    with: { project: { with: { usersToProjects: true, events: true } } }
  });
  if (!board$1)
    return error(400);
  const viewAllowed = board$1.project?.usersToProjects.some(
    (userToProject) => userToProject.userId === session.user.userId
  );
  if (!viewAllowed)
    return error(404);
  return { board: board$1 };
};
export {
  actions,
  load
};
