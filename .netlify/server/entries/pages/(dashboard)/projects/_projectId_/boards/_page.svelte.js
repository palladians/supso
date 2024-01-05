import { c as create_ssr_component, v as validate_component, a as subscribe, k as each, j as add_attribute, e as escape } from "../../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../../chunks/card-title.js";
import "clsx";
import { B as Button } from "../../../../../../chunks/index5.js";
import { B as Badge } from "../../../../../../chunks/index6.js";
import { c as currentProjectId } from "../../../../../../chunks/user.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { P as PlusIcon } from "../../../../../../chunks/plus.js";
const Kanban_square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
      }
    ],
    ["path", { "d": "M8 7v7" }],
    ["path", { "d": "M12 7v4" }],
    ["path", { "d": "M16 7v9" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "kanban-square" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const KanbanSquareIcon = Kanban_square;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentProjectId, $$unsubscribe_currentProjectId;
  $$unsubscribe_currentProjectId = subscribe(currentProjectId, (value) => $currentProjectId = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_currentProjectId();
  return `<div class="flex flex-col gap-4"><div class="flex justify-between"><h2 class="text-lg font-semibold" data-svelte-h="svelte-18pcmcy">Boards</h2> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      href: `/projects/${$currentProjectId}/boards/create`,
      variant: "secondary",
      class: "gap-1"
    },
    {},
    {
      default: () => {
        return `${validate_component(PlusIcon, "PlusIcon").$$render($$result, { size: 16 }, {}, {})}
			Create Board`;
      }
    }
  )}</div> <div class="grid grid-cols-4 gap-8">${each(data.boards, (board) => {
    return `<a${add_attribute("href", `/boards/${board.id}`, 0)}>${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, { class: "items-start gap-2" }, {}, {
          default: () => {
            return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(board.name)}`;
              }
            })} ${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
              default: () => {
                return `${escape(board.tag)}`;
              }
            })} `;
          }
        })} `;
      }
    })} </a>`;
  })} <a${add_attribute("href", `/projects/${$currentProjectId}/boards/create`, 0)} class="flex flex-1">${validate_component(Card, "Card.Root").$$render($$result, { class: "flex-1" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, { class: "flex flex-1 justify-center" }, {}, {
        default: () => {
          return `<div class="mt-2 flex flex-1 items-center gap-2 pt-1">${validate_component(KanbanSquareIcon, "KanbanSquareIcon").$$render($$result, {}, {}, {})} ${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Create`;
            }
          })}</div>`;
        }
      })}`;
    }
  })}</a></div></div>`;
});
export {
  Page as default
};
