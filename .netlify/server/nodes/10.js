import * as server from '../entries/pages/(dashboard)/projects/_projectId_/boards/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(dashboard)/projects/_projectId_/boards/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(dashboard)/projects/[projectId]/boards/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.RTOiPqhi.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js","_app/immutable/chunks/Icon.Eq9yyB-p.js","_app/immutable/chunks/index.Scxk-BtT.js","_app/immutable/chunks/card-title.aCBwwilC.js","_app/immutable/chunks/index.gfqyTNeI.js","_app/immutable/chunks/index.xg8ZB9CL.js","_app/immutable/chunks/index.V7OS_k57.js","_app/immutable/chunks/user.l-GSgzKG.js","_app/immutable/chunks/plus.szSpHpP6.js"];
export const stylesheets = [];
export const fonts = [];
