import { r as redirect } from "../../chunks/index.js";
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session)
    throw redirect(302, "/projects");
  if (!session)
    throw redirect(302, "/signin");
};
export {
  load
};
