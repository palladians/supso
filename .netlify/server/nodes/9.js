import * as server from '../entries/pages/(dashboard)/projects/_projectId_/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(dashboard)/projects/_projectId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(dashboard)/projects/[projectId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.7GnOTvPC.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js","_app/immutable/chunks/Icon.Eq9yyB-p.js","_app/immutable/chunks/index.Scxk-BtT.js","_app/immutable/chunks/stores.OOgZkMsa.js","_app/immutable/chunks/singletons.PgCenvZ-.js","_app/immutable/chunks/index.xg8ZB9CL.js","_app/immutable/chunks/card-title.aCBwwilC.js","_app/immutable/chunks/card-content.9uwQkJRc.js","_app/immutable/chunks/table-row.4pXDqKMz.js","_app/immutable/chunks/index.gfqyTNeI.js","_app/immutable/chunks/array.uDkXX06J.js","_app/immutable/chunks/updater.AMMtptR1.js","_app/immutable/chunks/events.IQnP7g6l.js","_app/immutable/chunks/index.V7OS_k57.js","_app/immutable/chunks/user.l-GSgzKG.js","_app/immutable/chunks/date.wyi4jurw.js","_app/immutable/chunks/settings.Q0ht7I_Q.js"];
export const stylesheets = [];
export const fonts = [];
