import { c as create_ssr_component, v as validate_component, k as each, e as escape } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../chunks/card-content.js";
import "clsx";
import { B as Button } from "../../../../chunks/index5.js";
import "../../../../chunks/user.js";
import { P as PlusIcon } from "../../../../chunks/plus.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="flex flex-1 items-center justify-center">${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Select Project`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, { class: "flex flex-col gap-2" }, {}, {
        default: () => {
          return `${each(data.projects, (project) => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                variant: "secondary",
                href: `/projects/${project.id}`
              },
              {},
              {
                default: () => {
                  return `${escape(project.name)}`;
                }
              }
            )}`;
          })} ${validate_component(Button, "Button").$$render($$result, { href: "/projects/create", class: "gap-1" }, {}, {
            default: () => {
              return `${validate_component(PlusIcon, "PlusIcon").$$render($$result, { size: 16 }, {}, {})} <span data-svelte-h="svelte-xebopv">Create Project</span>`;
            }
          })}`;
        }
      })}`;
    }
  })}</div>`;
});
export {
  Page as default
};
