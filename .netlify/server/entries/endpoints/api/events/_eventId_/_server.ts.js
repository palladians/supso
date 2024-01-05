import { e as error } from "../../../../../chunks/index.js";
import { d as db, e as event } from "../../../../../chunks/index3.js";
import { eq } from "drizzle-orm";
const GET = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session)
    return error(400);
  const event$1 = await db.query.event.findFirst({
    where: eq(event.id, params.eventId),
    with: { project: { with: { usersToProjects: true } } }
  });
  if (!event$1)
    return error(404);
  const permitted = event$1.project.usersToProjects.some(
    (userToProject) => userToProject.userId === session.user.userId
  );
  if (!permitted)
    return error(404);
  return Response.json({ event: event$1 });
};
export {
  GET
};
