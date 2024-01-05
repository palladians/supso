import { c as create_ssr_component, d as compute_rest_props, f as spread, h as escape_attribute_value, i as escape_object, a as subscribe, v as validate_component, j as add_attribute, k as each, e as escape } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../chunks/card-content.js";
import "clsx";
import { T as Table, a as Table_header, b as Table_row, c as Table_head, d as Table_body, e as Table_cell } from "../../../../chunks/table-row.js";
import { L as Label, I as Input } from "../../../../chunks/input.js";
import { B as Button } from "../../../../chunks/index5.js";
import { S as Separator } from "../../../../chunks/separator.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title } from "../../../../chunks/index7.js";
import { c as cn } from "../../../../chunks/utils.js";
import { R as Root$1, A as Alert_dialog_content, a as Alert_dialog_header, b as Alert_dialog_title, c as Alert_dialog_description, d as Alert_dialog_footer, e as Alert_dialog_cancel, f as Alert_dialog_action } from "../../../../chunks/index8.js";
import { w as writable } from "../../../../chunks/index2.js";
import { X as XIcon } from "../../../../chunks/x.js";
import { P as PlusIcon } from "../../../../chunks/plus.js";
const Dialog_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Create_token_dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $open, $$unsubscribe_open;
  let { open } = $$props;
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$unsubscribe_open();
  return `${validate_component(Root, "Dialog.Root").$$render(
    $$result,
    {
      open: $open,
      onOpenChange: (value) => open.set(value)
    },
    {},
    {
      default: () => {
        return `${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
          default: () => {
            return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `Create Token`;
                  }
                })}`;
              }
            })} <form id="tokenForm" action="?/createToken" method="POST" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "tokenName" }, {}, {
              default: () => {
                return `Token Name`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "tokenName",
                name: "name",
                required: true
              },
              {},
              {}
            )}</fieldset></form> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { type: "submit", form: "tokenForm" }, {}, {
                  default: () => {
                    return `Save changes`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}`;
});
const Delete_token_alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $open, $$unsubscribe_open;
  let { open } = $$props;
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$unsubscribe_open();
  return `${validate_component(Root$1, "AlertDialog.Root").$$render(
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
                    return `This action cannot be undone. This will permanently delete the token and all integrations
				using this token will be invalid.`;
                  }
                })}`;
              }
            })} ${validate_component(Alert_dialog_footer, "AlertDialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Alert_dialog_cancel, "AlertDialog.Cancel").$$render($$result, {}, {}, {
                  default: () => {
                    return `Cancel`;
                  }
                })} <form action="?/deleteToken" method="POST"><input type="hidden" name="id"${add_attribute("value", $open, 0)}> ${validate_component(Alert_dialog_action, "AlertDialog.Action").$$render($$result, { type: "submit" }, {}, {
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
  let { username } = $$props;
  const createTokenDialogOpen = writable(false);
  const deleteTokenAlertId = writable(null);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.createTokenDialogOpen === void 0 && $$bindings.createTokenDialogOpen && createTokenDialogOpen !== void 0)
    $$bindings.createTokenDialogOpen(createTokenDialogOpen);
  if ($$props.deleteTokenAlertId === void 0 && $$bindings.deleteTokenAlertId && deleteTokenAlertId !== void 0)
    $$bindings.deleteTokenAlertId(deleteTokenAlertId);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    username = username ?? data.user.username;
    $$rendered = `<div class="flex flex-1 items-center justify-center">${validate_component(Create_token_dialog, "CreateTokenDialog").$$render($$result, { open: createTokenDialogOpen }, {}, {})} ${validate_component(Delete_token_alert, "DeleteTokenAlert").$$render($$result, { open: deleteTokenAlertId }, {}, {})} ${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
              default: () => {
                return `Profile`;
              }
            })}`;
          }
        })} ${validate_component(Card_content, "Card.Content").$$render($$result, { class: "flex flex-col gap-8" }, {}, {
          default: () => {
            return `<form action="?/updateProfile" method="POST" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "username" }, {}, {
              default: () => {
                return `Username`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "username",
                name: "username",
                value: username
              },
              {
                value: ($$value) => {
                  username = $$value;
                  $$settled = false;
                }
              },
              {}
            )}</fieldset> <fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "email" }, {}, {
              default: () => {
                return `Email Address`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              {
                id: "email",
                value: data.user.email,
                disabled: true
              },
              {},
              {}
            )}</fieldset> ${validate_component(Button, "Button").$$render($$result, { type: "submit", class: "self-end" }, {}, {
              default: () => {
                return `Save`;
              }
            })}</form> ${validate_component(Separator, "Separator").$$render($$result, {}, {}, {})} <div class="flex flex-col gap-4"><div class="flex items-center justify-between"><h2 class="font-semibold" data-svelte-h="svelte-18gf92c">Access Tokens</h2> ${validate_component(Button, "Button").$$render($$result, { variant: "secondary", class: "gap-1" }, {}, {
              default: () => {
                return `${validate_component(PlusIcon, "PlusIcon").$$render($$result, { size: 16 }, {}, {})}
						Create Token`;
              }
            })}</div> ${validate_component(Table, "Table.Root").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                          default: () => {
                            return `Name`;
                          }
                        })} ${validate_component(Table_head, "Table.Head").$$render($$result, { class: "w-[12rem]" }, {}, {
                          default: () => {
                            return `Token`;
                          }
                        })} ${validate_component(Table_head, "Table.Head").$$render($$result, { class: "text-right" }, {}, {
                          default: () => {
                            return `Actions`;
                          }
                        })}`;
                      }
                    })}`;
                  }
                })} ${validate_component(Table_body, "Table.Body").$$render($$result, {}, {}, {
                  default: () => {
                    return `${each(data.accessTokens, (token) => {
                      return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "font-medium" }, {}, {
                            default: () => {
                              return `${escape(token.name)}`;
                            }
                          })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "w-[12rem]" }, {}, {
                            default: () => {
                              return `${escape(token.id)}`;
                            }
                          })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "flex justify-end" }, {}, {
                            default: () => {
                              return `${validate_component(Button, "Button").$$render($$result, { size: "icon", variant: "secondary" }, {}, {
                                default: () => {
                                  return `${validate_component(XIcon, "XIcon").$$render($$result, { size: 16 }, {}, {})} `;
                                }
                              })} `;
                            }
                          })} `;
                        }
                      })}`;
                    })}`;
                  }
                })}`;
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
