import * as server from '../entries/pages/(dashboard)/boards/_boardId_/settings/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(dashboard)/boards/_boardId_/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(dashboard)/boards/[boardId]/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.msDldQXv.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js","_app/immutable/chunks/card-title.aCBwwilC.js","_app/immutable/chunks/index.Scxk-BtT.js","_app/immutable/chunks/card-content.9uwQkJRc.js","_app/immutable/chunks/index.gfqyTNeI.js","_app/immutable/chunks/index.xg8ZB9CL.js","_app/immutable/chunks/input.aQcHfZ93.js","_app/immutable/chunks/events.IQnP7g6l.js","_app/immutable/chunks/separator._w4sPm_0.js","_app/immutable/chunks/create.QB3qBgCU.js","_app/immutable/chunks/updater.AMMtptR1.js","_app/immutable/chunks/index.7Dvp-JUu.js","_app/immutable/chunks/index.APPpe9Mj.js","_app/immutable/chunks/create.dDoUJOBE.js","_app/immutable/chunks/array.uDkXX06J.js","_app/immutable/chunks/portal.4G6cbCnc.js","_app/immutable/chunks/focus.SAoc9JFK.js","_app/immutable/chunks/chevron-left.syJYjmci.js","_app/immutable/chunks/Icon.Eq9yyB-p.js"];
export const stylesheets = [];
export const fonts = [];
