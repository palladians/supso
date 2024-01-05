import { c as create_ssr_component, d as compute_rest_props, f as spread, h as escape_attribute_value, i as escape_object, l as add_classes, e as escape, n as createEventDispatcher, v as validate_component, a as subscribe, j as add_attribute } from "../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../chunks/card-content.js";
import "clsx";
import { B as Badge } from "../../../../../chunks/index6.js";
import register from "highlight.js/lib/languages/json";
import { c as currentProjectId } from "../../../../../chunks/user.js";
import hljs from "highlight.js/lib/core";
const css = {
  code: ".langtag.svelte-11sh29b{position:relative}.langtag.svelte-11sh29b::after{content:attr(data-language);position:absolute;top:0;right:0;padding:1em;display:flex;align-items:center;justify-content:center;background:var(--langtag-background, inherit);color:var(--langtag-color, inherit);border-radius:var(--langtag-border-radius)}",
  map: null
};
const LangTag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["code", "highlighted", "languageName", "langtag"]);
  let { code } = $$props;
  let { highlighted } = $$props;
  let { languageName = "plaintext" } = $$props;
  let { langtag = false } = $$props;
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.highlighted === void 0 && $$bindings.highlighted && highlighted !== void 0)
    $$bindings.highlighted(highlighted);
  if ($$props.languageName === void 0 && $$bindings.languageName && languageName !== void 0)
    $$bindings.languageName(languageName);
  if ($$props.langtag === void 0 && $$bindings.langtag && langtag !== void 0)
    $$bindings.langtag(langtag);
  $$result.css.add(css);
  return `<pre${spread(
    [
      {
        "data-language": escape_attribute_value(languageName)
      },
      escape_object($$restProps)
    ],
    {
      classes: (langtag ? "langtag" : "") + " svelte-11sh29b"
    }
  )}><code${add_classes("hljs".trim())}>${highlighted ? `<!-- HTML_TAG_START -->${highlighted}<!-- HTML_TAG_END -->` : `${escape(code)}`}</code></pre>`;
});
const LangTag$1 = LangTag;
const Highlight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["language", "code", "langtag"]);
  let { language } = $$props;
  let { code } = $$props;
  let { langtag = false } = $$props;
  createEventDispatcher();
  let highlighted = "";
  if ($$props.language === void 0 && $$bindings.language && language !== void 0)
    $$bindings.language(language);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.langtag === void 0 && $$bindings.langtag && langtag !== void 0)
    $$bindings.langtag(langtag);
  {
    {
      hljs.registerLanguage(language.name, language.register);
      highlighted = hljs.highlight(code, { language: language.name }).value;
    }
  }
  return `${slots.default ? slots.default({ highlighted }) : ` ${validate_component(LangTag$1, "LangTag").$$render($$result, Object.assign({}, $$restProps, { languageName: language.name }, { langtag }, { highlighted }, { code }), {}, {})} `}`;
});
const Highlight$1 = Highlight;
const json = { name: "json", register };
const json$1 = json;
const githubDark = `<style>pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/.hljs{color:#c9d1d9;background:#0d1117}.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_{color:#ff7b72}.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_{color:#d2a8ff}.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id{color:#79c0ff}.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string{color:#a5d6ff}.hljs-built_in,
.hljs-symbol{color:#ffa657}.hljs-comment,
.hljs-code,
.hljs-formula{color:#8b949e}.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo{color:#7ee787}.hljs-subst{color:#c9d1d9}.hljs-section{color:#1f6feb;font-weight:bold}.hljs-bullet{color:#f2cc60}.hljs-emphasis{color:#c9d1d9;font-style:italic}.hljs-strong{color:#c9d1d9;font-weight:bold}.hljs-addition{color:#aff5b4;background-color:#033a16}.hljs-deletion{color:#ffdcd7;background-color:#67060c}</style>`;
const githubDark$1 = githubDark;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentProjectId, $$unsubscribe_currentProjectId;
  $$unsubscribe_currentProjectId = subscribe(currentProjectId, (value) => $currentProjectId = value);
  let { data } = $$props;
  const tags = JSON.stringify(data.event.tags, null, 4);
  const context = JSON.stringify(data.event.context, null, 4);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.context === void 0 && $$bindings.context && context !== void 0)
    $$bindings.context(context);
  $$unsubscribe_currentProjectId();
  return `${$$result.head += `<!-- HEAD_svelte-hw7p1f_START --><!-- HTML_TAG_START -->${githubDark$1}<!-- HTML_TAG_END --><!-- HEAD_svelte-hw7p1f_END -->`, ""} <div class="flex gap-4"><div class="flex flex-[2] flex-col gap-8"><div class="flex gap-2"><a class="text-muted-foreground" href="/projects" data-svelte-h="svelte-um4f9x">Projects</a> <span class="text-muted" data-svelte-h="svelte-1ds2g5f">/</span> <a class="text-muted-foreground"${add_attribute("href", `/projects/${$currentProjectId}`, 0)}>Pallad</a> <span class="text-muted" data-svelte-h="svelte-1ds2g5f">/</span> <a class="text-muted-foreground"${add_attribute("href", `/projects/${$currentProjectId}/events`, 0)}>Events</a></div> <div class="grid grid-cols-[1fr_3fr] items-center justify-center gap-6"><p class="text-muted-foreground" data-svelte-h="svelte-14vxxc5">ID</p> <p>${escape(data.event.id)}</p> <p class="text-muted-foreground" data-svelte-h="svelte-47xdtm">Event</p> <div>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `${escape(data.event.event)}`;
    }
  })}</div> <p class="text-muted-foreground" data-svelte-h="svelte-16xylqt">Channel</p> <div>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `#${escape(data.event.channel)}`;
    }
  })}</div> <p class="text-muted-foreground" data-svelte-h="svelte-u7mr9y">Notified</p> <div>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `${escape(data.event.notify)}`;
    }
  })}</div> <p class="text-muted-foreground" data-svelte-h="svelte-19ijlvx">Tags</p> ${validate_component(Highlight$1, "Highlight").$$render($$result, { language: json$1, code: tags }, {}, {})}</div></div> <div class="flex-1">${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Context`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Highlight$1, "Highlight").$$render($$result, { language: json$1, code: context }, {}, {})}`;
        }
      })}`;
    }
  })}</div></div>`;
});
export {
  Page as default
};
