import { d as db, p as project, e as event } from "../../../../../chunks/index3.js";
import { eq, and, desc } from "drizzle-orm";
import { groupBy, take } from "rambda";
import { e as error } from "../../../../../chunks/index.js";
import { a as formatDateShort } from "../../../../../chunks/date.js";
import colors from "tailwindcss/colors.js";
import { eachDayOfInterval, format } from "date-fns";
import { enUS } from "date-fns/locale";
const daysOfWeek = eachDayOfInterval({
  start: new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 6)),
  end: /* @__PURE__ */ new Date()
});
const weekdays = daysOfWeek.map((day) => format(day, "P", { locale: enUS }));
const buildChartTemplate = ({
  dates,
  events
}) => ({
  labels: dates,
  datasets: [
    {
      label: "Events",
      data: events,
      backgroundColor: [colors.cyan[500]],
      borderWidth: 2,
      borderColor: [colors.cyan[300]],
      borderRadius: 8
    }
  ]
});
const fetchEvents = async ({ params, session }) => {
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
    where: and(eq(event.projectId, currentProject.id)),
    orderBy: desc(event.createdAt)
  });
};
const buildEventsChartData = ({ eventsByDate }) => {
  const dateEvents = weekdays.map((date) => ({ date, events: eventsByDate[date]?.length ?? 0 }));
  return buildChartTemplate({
    dates: dateEvents.map((entry) => entry.date),
    events: dateEvents.map((entry) => entry.events)
  });
};
const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  const events = await fetchEvents({ session, params });
  const eventsByDate = groupBy(
    (events2) => events2.date,
    events.map((event2) => ({ ...event2, date: formatDateShort(event2.createdAt ?? "") }))
  );
  const eventsChartData = buildEventsChartData({ eventsByDate });
  const lastFiveEvents = take(5, events);
  return { lastFiveEvents, eventsChartData };
};
export {
  load
};
