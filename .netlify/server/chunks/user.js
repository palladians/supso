import { w as writable } from "./index2.js";
const persistedValue = null;
const currentProjectId = writable(persistedValue);
currentProjectId.subscribe((value) => {
  return;
});
export {
  currentProjectId as c
};
