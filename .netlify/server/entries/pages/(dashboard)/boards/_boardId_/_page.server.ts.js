import { d as db, b as board } from "../../../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { e as error } from "../../../../../chunks/index.js";
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
  const boardEvents = board$1.project.events.filter((event) => {
    const tags = event.tags;
    return tags[board$1.tag];
  });
  const boardOptions = board$1.options;
  const eventsByOption = boardOptions.map((option) => [
    option,
    boardEvents.filter((event) => {
      const tags = event.tags;
      return tags[board$1.tag] === option;
    })
  ]);
  return { board: board$1, eventsByOption };
};
export {
  load
};
