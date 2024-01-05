import { c as create_ssr_component, d as compute_rest_props, f as spread, h as escape_attribute_value, i as escape_object, a as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../chunks/card-title.js";
import { C as Card_content } from "../../../chunks/card-content.js";
import "clsx";
import { L as Label, I as Input } from "../../../chunks/input.js";
import { B as Button } from "../../../chunks/index5.js";
import { tv } from "tailwind-variants";
import { c as cn, i as is_void } from "../../../chunks/utils.js";
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn(alertVariants({ variant }), className))
      },
      escape_object($$restProps),
      { role: "alert" }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Alert_description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("text-sm [&_p]:leading-relaxed", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Alert_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "level"]);
  let { class: className = void 0 } = $$props;
  let { level = "h5" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  return `${((tag) => {
    return tag ? `<${level}${spread(
      [
        {
          class: escape_attribute_value(cn("mb-1 font-medium leading-none tracking-tight", className))
        },
        escape_object($$restProps)
      ],
      {}
    )}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(level)}`;
});
const alertVariants = tv({
  base: "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive: "text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let searchParams;
  let error;
  let success;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  searchParams = $page.url.searchParams;
  error = searchParams.get("error") === "true";
  success = searchParams.get("success") === "true";
  $$unsubscribe_page();
  return `<div class="flex min-h-screen flex-col items-center justify-center">${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Sign In`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, { class: "flex flex-col gap-8" }, {}, {
        default: () => {
          return `${success ? `${validate_component(Alert, "Alert.Root").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
                default: () => {
                  return `Heads up!`;
                }
              })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
                default: () => {
                  return `We&#39;ve just sent you an email with a link to sign in.`;
                }
              })}`;
            }
          })}` : ``} ${error ? `${validate_component(Alert, "Alert.Root").$$render($$result, { variant: "destructive" }, {}, {
            default: () => {
              return `${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
                default: () => {
                  return `Oooops!`;
                }
              })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
                default: () => {
                  return `There was a problem sending you the verification email.`;
                }
              })}`;
            }
          })}` : ``} <form method="POST" class="flex flex-col gap-4"><fieldset class="flex flex-col gap-2">${validate_component(Label, "Label").$$render($$result, { for: "email" }, {}, {
            default: () => {
              return `Email Address`;
            }
          })} ${validate_component(Input, "Input").$$render($$result, { id: "email", name: "email" }, {}, {})}</fieldset> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
            default: () => {
              return `Sign In`;
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
