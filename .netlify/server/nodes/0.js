

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.YRW4EJ7x.js","_app/immutable/chunks/scheduler.lTWvBqUS.js","_app/immutable/chunks/index.7kHk89l9.js"];
export const stylesheets = ["_app/immutable/assets/0.owXrcG0M.css"];
export const fonts = [];
