import * as server from '../entries/pages/(dashboard)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(dashboard)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(dashboard)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.6ZKAcTPK.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js","_app/immutable/chunks/Icon.Eq9yyB-p.js","_app/immutable/chunks/index.Scxk-BtT.js","_app/immutable/chunks/index.gfqyTNeI.js","_app/immutable/chunks/index.xg8ZB9CL.js","_app/immutable/chunks/events.IQnP7g6l.js","_app/immutable/chunks/updater.AMMtptR1.js","_app/immutable/chunks/avatar-fallback.kskSYWbx.js","_app/immutable/chunks/portal.4G6cbCnc.js","_app/immutable/chunks/array.uDkXX06J.js","_app/immutable/chunks/helpers._QvnV5B-.js","_app/immutable/chunks/focus.SAoc9JFK.js","_app/immutable/chunks/create.QB3qBgCU.js","_app/immutable/chunks/user.l-GSgzKG.js","_app/immutable/chunks/singletons.PgCenvZ-.js","_app/immutable/chunks/stores.OOgZkMsa.js","_app/immutable/chunks/chevron-down.Mg9WI1Ym.js","_app/immutable/chunks/plus.szSpHpP6.js"];
export const stylesheets = [];
export const fonts = [];
