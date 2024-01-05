import { d as db, p as project, e as event } from "../../../../../../chunks/index3.js";
import { eq, and, lt, desc } from "drizzle-orm";
import { e as error } from "../../../../../../chunks/index.js";
import { uniq } from "rambda";
const PAGE_SIZE = 10;
const fetchEvents = async ({
  params,
  session,
  lastCursor
}) => {
  const currentProject = await db.query.project.findFirst({
    where: eq(project.id, params.projectId),
    with: { usersToProjects: true }
  });
  if (!currentProject)
    return error(400, "Project not found");
  const membershipExists = currentProject.usersToProjects.some(
    (userToProject) => userToProject.userId === session.user.userId
  );
  if (!membershipExists)
    return error(400, "Unauthorized.");
  return db.query.event.findMany({
    where: and(
      eq(event.projectId, currentProject.id),
      lastCursor ? lt(event.createdAt, lastCursor) : void 0
    ),
    orderBy: desc(event.createdAt),
    limit: PAGE_SIZE
  });
};
const load = async ({ locals, params, url }) => {
  const lastCursor = url.searchParams.get("last_cursor");
  const session = await locals.auth.validate();
  const events = await fetchEvents({ session, params, lastCursor });
  const channels = uniq(events.map((event2) => event2.channel));
  const eventNames = uniq(events.map((event2) => event2.event));
  const pages = Math.floor(events.length / PAGE_SIZE);
  return { events, channels, eventNames, pages };
};
export {
  load
};
