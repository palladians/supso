import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../chunks/card-content.js";
import "clsx";
import { L as Label, I as Input } from "../../../../../chunks/input.js";
import { B as Button } from "../../../../../chunks/index5.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="flex flex-1 items-center justify-center">${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Create Project`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `<form method="POST" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
            default: () => {
              return `Project Name`;
            }
          })} ${validate_component(Input, "Input").$$render($$result, { id: "name", name: "name" }, {}, {})}</fieldset> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
            default: () => {
              return `Create`;
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
