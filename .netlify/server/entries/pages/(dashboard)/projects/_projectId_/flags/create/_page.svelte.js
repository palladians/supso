import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../../../chunks/card-content.js";
import "clsx";
import { L as Label, I as Input } from "../../../../../../../chunks/input.js";
import { B as Button } from "../../../../../../../chunks/index5.js";
import { c as currentProjectId } from "../../../../../../../chunks/user.js";
import { C as ChevronLeftIcon } from "../../../../../../../chunks/chevron-left.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentProjectId, $$unsubscribe_currentProjectId;
  $$unsubscribe_currentProjectId = subscribe(currentProjectId, (value) => $currentProjectId = value);
  $$unsubscribe_currentProjectId();
  return `<div class="flex flex-1 items-center justify-center">${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center gap-4">${validate_component(Button, "Button").$$render(
            $$result,
            {
              href: `/projects/${$currentProjectId}/flags`,
              variant: "secondary",
              size: "icon"
            },
            {},
            {
              default: () => {
                return `${validate_component(ChevronLeftIcon, "ChevronLeftIcon").$$render($$result, { size: 16 }, {}, {})}`;
              }
            }
          )} ${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Create Feature Flag`;
            }
          })}</div>`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `<form method="POST" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "flagName" }, {}, {
            default: () => {
              return `Flag Name`;
            }
          })} ${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "flagName",
              name: "name",
              required: true
            },
            {},
            {}
          )}</fieldset> <fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "flagDescription" }, {}, {
            default: () => {
              return `Flag Description`;
            }
          })} ${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "flagDescription",
              name: "description"
            },
            {},
            {}
          )}</fieldset> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
            default: () => {
              return `Create Flag`;
            }
          })}</form>`;
        }
      })}`;
    }
  })}</div>`;
});
export {
  Page as default
};
