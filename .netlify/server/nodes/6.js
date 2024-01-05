import * as server from '../entries/pages/(dashboard)/events/_eventId_/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(dashboard)/events/_eventId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(dashboard)/events/[eventId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.ddAvjeDS.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js","_app/immutable/chunks/card-title.aCBwwilC.js","_app/immutable/chunks/index.Scxk-BtT.js","_app/immutable/chunks/card-content.9uwQkJRc.js","_app/immutable/chunks/index.V7OS_k57.js","_app/immutable/chunks/user.l-GSgzKG.js","_app/immutable/chunks/index.xg8ZB9CL.js"];
export const stylesheets = ["_app/immutable/assets/6.-sNVQhlW.css"];
export const fonts = [];
