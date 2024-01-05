import { c as create_ssr_component, a as subscribe, v as validate_component, j as add_attribute } from "../../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../../chunks/card-content.js";
import "clsx";
import { B as Button } from "../../../../../../chunks/index5.js";
import { L as Label, I as Input } from "../../../../../../chunks/input.js";
import { S as Separator } from "../../../../../../chunks/separator.js";
import { w as writable } from "../../../../../../chunks/index2.js";
import { R as Root, A as Alert_dialog_content, a as Alert_dialog_header, b as Alert_dialog_title, c as Alert_dialog_description, d as Alert_dialog_footer, e as Alert_dialog_cancel, f as Alert_dialog_action } from "../../../../../../chunks/index8.js";
import { C as ChevronLeftIcon } from "../../../../../../chunks/chevron-left.js";
const Delete_board_alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $open, $$unsubscribe_open;
  let { open } = $$props;
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$unsubscribe_open();
  return `${validate_component(Root, "AlertDialog.Root").$$render(
    $$result,
    {
      open: !!$open,
      onOpenChange: () => open.set(null)
    },
    {},
    {
      default: () => {
        return `${validate_component(Alert_dialog_content, "AlertDialog.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Alert_dialog_header, "AlertDialog.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Alert_dialog_title, "AlertDialog.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `Are you absolutely sure?`;
                  }
                })} ${validate_component(Alert_dialog_description, "AlertDialog.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `This action cannot be undone. This will permanently delete the board and the order of all its items.`;
                  }
                })}`;
              }
            })} ${validate_component(Alert_dialog_footer, "AlertDialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Alert_dialog_cancel, "AlertDialog.Cancel").$$render($$result, {}, {}, {
                  default: () => {
                    return `Cancel`;
                  }
                })} <form action="?/deleteBoard" method="POST"><input type="hidden" name="id"${add_attribute("value", $open, 0)}> ${validate_component(Alert_dialog_action, "AlertDialog.Action").$$render($$result, { type: "submit" }, {}, {
                  default: () => {
                    return `Continue`;
                  }
                })}</form>`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const deleteBoardAlertId = writable(null);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.deleteBoardAlertId === void 0 && $$bindings.deleteBoardAlertId && deleteBoardAlertId !== void 0)
    $$bindings.deleteBoardAlertId(deleteBoardAlertId);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex flex-1 items-center justify-center">${validate_component(Delete_board_alert, "DeleteBoardAlert").$$render($$result, { open: deleteBoardAlertId }, {}, {})} ${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="flex items-center gap-4">${validate_component(Button, "Button").$$render(
              $$result,
              {
                href: `/boards/${data.board.id}`,
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
                return `Board Settings`;
              }
            })}</div>`;
          }
        })} ${validate_component(Card_content, "Card.Content").$$render($$result, { class: "flex flex-col gap-8" }, {}, {
          default: () => {
            return `<form method="POST" action="?/updateBoard" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "boardName" }, {}, {
              default: () => {
                return `Board Name`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "boardName",
                name: "name",
                value: data.board.name
              },
              {
                value: ($$value) => {
                  data.board.name = $$value;
                  $$settled = false;
                }
              },
              {}
            )}</fieldset> <fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "boardTag" }, {}, {
              default: () => {
                return `Board Tag`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "boardTag",
                name: "tag",
                value: data.board.tag
              },
              {
                value: ($$value) => {
                  data.board.tag = $$value;
                  $$settled = false;
                }
              },
              {}
            )}</fieldset> <fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "boardTagValues" }, {}, {
              default: () => {
                return `Tag Values`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "boardTagValues",
                name: "tagValues",
                value: data.board.options
              },
              {
                value: ($$value) => {
                  data.board.options = $$value;
                  $$settled = false;
                }
              },
              {}
            )} <p class="text-muted-foreground text-sm" data-svelte-h="svelte-1fsyoap">Separate values with comma. Like: &quot;apple,pear,banana&quot;</p></fieldset> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
              default: () => {
                return `Update Board`;
              }
            })}</form> ${validate_component(Separator, "Separator").$$render($$result, {}, {}, {})} <div class="flex flex-col gap-4"><h2 class="font-semibold" data-svelte-h="svelte-llii55">Danger Zone</h2> ${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
              default: () => {
                return `Delete Board`;
              }
            })}</div>`;
          }
        })}`;
      }
    })}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
