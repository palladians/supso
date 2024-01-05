import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, k as each } from "../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../chunks/card-content.js";
import "clsx";
import { B as Badge } from "../../../../../chunks/index6.js";
import { B as Button } from "../../../../../chunks/index5.js";
import { f as formatDate } from "../../../../../chunks/date.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title } from "../../../../../chunks/index7.js";
import { w as writable } from "../../../../../chunks/index2.js";
import { S as SettingsIcon } from "../../../../../chunks/settings.js";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var FEATURE_FLAG_NAMES = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
});
_defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list"), _ID_TO_INSTRUCTION;
const Event_details_dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $open, $$unsubscribe_open;
  let { open } = $$props;
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  let { data = null } = $$props;
  open.subscribe(async (id) => {
    if (!id)
      return;
    const response = await fetch(`/api/events/${id}`);
    const { event } = await response.json();
    data = event;
  });
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_open();
  return `${validate_component(Root, "Dialog.Root").$$render(
    $$result,
    {
      open: !!$open,
      onOpenChange: () => open.set(null)
    },
    {},
    {
      default: () => {
        return `${validate_component(Dialog_content, "Dialog.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `${escape(data?.event)}`;
                  }
                })}`;
              }
            })} <div class="flex flex-col gap-4">${escape(data?.channel)}</div>`;
          }
        })}`;
      }
    }
  )}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const eventDetailsId = writable(null);
  const options = data.board.options;
  const handleDndConsider = (column, e) => {
    data.eventsByOption[column][1] = e.detail.items;
  };
  const handleDndFinalize = (column, e) => {
    const updatedEvents = e.detail.items;
    data.eventsByOption[column][1] = updatedEvents;
    const movedItemId = e.detail.info.id;
    const updatedEvent = updatedEvents.find((event) => event.id === movedItemId);
    if (!updatedEvent)
      return;
    console.log(">>>F", data.eventsByOption[column]);
    console.log(">>>T", updatedEvent);
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.eventDetailsId === void 0 && $$bindings.eventDetailsId && eventDetailsId !== void 0)
    $$bindings.eventDetailsId(eventDetailsId);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.handleDndConsider === void 0 && $$bindings.handleDndConsider && handleDndConsider !== void 0)
    $$bindings.handleDndConsider(handleDndConsider);
  if ($$props.handleDndFinalize === void 0 && $$bindings.handleDndFinalize && handleDndFinalize !== void 0)
    $$bindings.handleDndFinalize(handleDndFinalize);
  return `<div class="flex flex-col gap-4">${validate_component(Event_details_dialog, "EventDetailsDialog").$$render($$result, { open: eventDetailsId }, {}, {})} <div class="flex justify-between items-center"><h2 class="text-lg font-semibold">${escape(data.board.name)}</h2> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      href: `/boards/${data.board.id}/settings`,
      variant: "secondary",
      class: "gap-1"
    },
    {},
    {
      default: () => {
        return `${validate_component(SettingsIcon, "SettingsIcon").$$render($$result, { size: 16 }, {}, {})} <span data-svelte-h="svelte-780lnr">Board Settings</span>`;
      }
    }
  )}</div> <div class="flex gap-4">${each(data.eventsByOption, (optionEvents, i) => {
    optionEvents[1];
    return ` ${validate_component(Card, "Card.Root").$$render($$result, { class: "max-w-[24rem] w-full" }, {}, {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(optionEvents[0])}`;
              }
            })} `;
          }
        })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="min-h-[2rem] flex flex-col gap-2">${each(optionEvents[1], (event) => {
              return `<div>${validate_component(Card, "Card.Root").$$render(
                $$result,
                {
                  class: "flex flex-col items-start max-w-[24rem] w-full p-4 gap-2"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
                      default: () => {
                        return `#${escape(event.channel)}`;
                      }
                    })} <h2 class="font-semibold">${escape(event.event)}</h2> <p class="text-sm text-muted-foreground">${escape(formatDate(event.createdAt))}</p> `;
                  }
                }
              )} </div>`;
            })}</div> `;
          }
        })} `;
      }
    })}`;
  })}</div></div>`;
});
export {
  Page as default
};
