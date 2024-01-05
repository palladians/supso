import { d as db, e as event } from "../../../../../chunks/index3.js";
import { eq } from "drizzle-orm";
import { e as error } from "../../../../../chunks/index.js";
const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  const event$1 = await db.query.event.findFirst({
    where: eq(event.id, params.eventId),
    with: { project: { with: { usersToProjects: true } } }
  });
  if (!event$1)
    return error(400);
  const viewAllowed = event$1.project?.usersToProjects.some(
    (userToProject) => userToProject.userId === session.user.userId
  );
  if (!viewAllowed)
    return error(404);
  return { event: event$1 };
};
export {
  load
};
