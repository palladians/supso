import { g as get_store_value, s as setContext, b as getContext, c as create_ssr_component, a as subscribe, d as compute_rest_props, f as spread, i as escape_object, j as add_attribute, v as validate_component, h as escape_attribute_value, e as escape, p as set_store_value, k as each } from "../../../../../../chunks/ssr.js";
import { T as Table, a as Table_header, b as Table_row, c as Table_head, d as Table_body, e as Table_cell } from "../../../../../../chunks/table-row.js";
import { c as cn, f as flyAndScale } from "../../../../../../chunks/utils.js";
import "clsx";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../../chunks/card-content.js";
import { B as Badge } from "../../../../../../chunks/index6.js";
import { f as safeOnMount, h as isBrowser$1, s as styleToString$3, e as effect, m as isElement, a as executeCallbacks$1, b as addMeltEventListener, i as isHTMLElement$1, n as noop, k as kbd$2, B as Button } from "../../../../../../chunks/index5.js";
import { f as formatDate } from "../../../../../../chunks/date.js";
import { g as generateIds, a as getPortalDestination, t as tick, r as removeScroll } from "../../../../../../chunks/portal.js";
import { w as writable, d as derived, r as readable } from "../../../../../../chunks/index2.js";
import { nanoid } from "nanoid/non-secure";
import "dequal";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { b as builder, c as createElHelpers, a as createBitAttrs$1, d as createDispatcher } from "../../../../../../chunks/events.js";
import { t as toWritableStores$1, a as omit$1, o as overridable, r as removeUndefined$1, g as getOptionUpdater } from "../../../../../../chunks/updater.js";
import { d as derivedVisible, u as usePopper, g as getPositioningUpdater } from "../../../../../../chunks/helpers.js";
import { h as handleFocus } from "../../../../../../chunks/focus.js";
import { C as Check } from "../../../../../../chunks/check.js";
import { X as XIcon } from "../../../../../../chunks/x.js";
const defaults$1 = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  defaultOpen: false,
  disableFocusTrap: false,
  closeOnEscape: true,
  preventScroll: false,
  onOpenChange: void 0,
  closeOnOutsideClick: true,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const { name } = createElHelpers("popover");
const popoverIdParts = ["trigger", "content"];
function createPopover(args) {
  const withDefaults = { ...defaults$1, ...args };
  const options = toWritableStores$1(omit$1(withDefaults, "open", "ids"));
  const { positioning, arrowSize, disableFocusTrap, preventScroll, closeOnEscape, closeOnOutsideClick, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const activeTrigger = writable(null);
  const ids = toWritableStores$1({ ...generateIds(popoverIdParts), ...withDefaults.ids });
  safeOnMount(() => {
    activeTrigger.set(document.getElementById(get_store_value(ids.trigger)));
  });
  function handleClose() {
    open.set(false);
    const triggerEl = document.getElementById(get_store_value(ids.trigger));
    handleFocus({ prop: get_store_value(closeFocus), defaultEl: triggerEl });
  }
  const isVisible = derivedVisible({ open, activeTrigger, forceVisible });
  const content = builder(name("content"), {
    stores: [isVisible, portal, ids.content],
    returned: ([$isVisible, $portal, $contentId]) => {
      return {
        hidden: $isVisible && isBrowser$1 ? void 0 : true,
        tabindex: -1,
        style: styleToString$3({
          display: $isVisible ? void 0 : "none"
        }),
        id: $contentId,
        "data-state": $isVisible ? "open" : "closed",
        "data-portal": $portal ? "" : void 0
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubDerived = effect([
        isVisible,
        activeTrigger,
        positioning,
        disableFocusTrap,
        closeOnEscape,
        closeOnOutsideClick,
        portal
      ], ([$isVisible, $activeTrigger, $positioning, $disableFocusTrap, $closeOnEscape, $closeOnOutsideClick, $portal]) => {
        unsubPopper();
        if (!$isVisible || !$activeTrigger)
          return;
        const popper = usePopper(node, {
          anchorElement: $activeTrigger,
          open,
          options: {
            floating: $positioning,
            focusTrap: $disableFocusTrap ? null : {
              returnFocusOnDeactivate: false,
              clickOutsideDeactivates: true,
              escapeDeactivates: true
            },
            clickOutside: $closeOnOutsideClick ? {
              handler: handleClickOutside
            } : null,
            escapeKeydown: $closeOnEscape ? {
              handler: () => {
                handleClose();
              }
            } : null,
            portal: getPortalDestination(node, $portal)
          }
        });
        if (popper && popper.destroy) {
          unsubPopper = popper.destroy;
        }
      });
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
        }
      };
    }
  });
  function toggleOpen(triggerEl) {
    open.update((prev) => {
      return !prev;
    });
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
  }
  function handleClickOutside(e) {
    get_store_value(onOutsideClick)?.(e);
    if (e.defaultPrevented)
      return;
    const target = e.target;
    const triggerEl = document.getElementById(get_store_value(ids.trigger));
    if (triggerEl && isElement(target)) {
      if (target === triggerEl || triggerEl.contains(target))
        return;
    }
    handleClose();
  }
  const trigger = builder(name("trigger"), {
    stores: [open, ids.content, ids.trigger],
    returned: ([$open, $contentId, $triggerId]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": $contentId,
        id: $triggerId
      };
    },
    action: (node) => {
      const unsub = executeCallbacks$1(addMeltEventListener(node, "click", () => {
        toggleOpen(node);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd$2.ENTER && e.key !== kbd$2.SPACE)
          return;
        e.preventDefault();
        toggleOpen(node);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const arrow = builder(name("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString$3({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  const close = builder(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks$1(addMeltEventListener(node, "click", (e) => {
        if (e.defaultPrevented)
          return;
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.defaultPrevented)
          return;
        if (e.key !== kbd$2.ENTER && e.key !== kbd$2.SPACE)
          return;
        e.preventDefault();
        toggleOpen();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
    if (!isBrowser$1)
      return;
    const unsubs = [];
    if ($open) {
      if (!$activeTrigger) {
        tick().then(() => {
          const triggerEl2 = document.getElementById(get_store_value(ids.trigger));
          if (!isHTMLElement$1(triggerEl2))
            return;
          activeTrigger.set(triggerEl2);
        });
      }
      if ($preventScroll) {
        unsubs.push(removeScroll());
      }
      const triggerEl = $activeTrigger ?? document.getElementById(get_store_value(ids.trigger));
      handleFocus({ prop: get_store_value(openFocus), defaultEl: triggerEl });
    }
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  return {
    ids,
    elements: {
      trigger,
      content,
      arrow,
      close
    },
    states: {
      open
    },
    options
  };
}
function getPopoverData() {
  const NAME2 = "popover";
  const PARTS2 = ["arrow", "close", "content", "trigger"];
  return {
    NAME: NAME2,
    PARTS: PARTS2
  };
}
function setCtx(props) {
  const { NAME: NAME2, PARTS: PARTS2 } = getPopoverData();
  const getAttrs = createBitAttrs$1(NAME2, PARTS2);
  const popover = {
    ...createPopover({
      ...removeUndefined$1(props),
      forceVisible: true
    }),
    getAttrs
  };
  setContext(NAME2, popover);
  return {
    ...popover,
    updateOption: getOptionUpdater(popover.options)
  };
}
function getCtx$1() {
  const { NAME: NAME2 } = getPopoverData();
  return getContext(NAME2);
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center"
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx$1();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Popover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { disableFocusTrap = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { updateOption, states: { open: localOpen }, ids } = setCtx({
    disableFocusTrap,
    closeOnEscape,
    closeOnOutsideClick,
    preventScroll,
    portal,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({ content: $contentId, trigger: $triggerId }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.disableFocusTrap === void 0 && $$bindings.disableFocusTrap && disableFocusTrap !== void 0)
    $$bindings.disableFocusTrap(disableFocusTrap);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0)
    $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("disableFocusTrap", disableFocusTrap);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Popover_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = false } = $$props;
  let { fitViewport = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0)
    $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0)
    $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0)
    $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0)
    $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0)
    $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0)
    $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0)
    $$bindings.fitViewport(fitViewport);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder2 = $content;
  {
    Object.assign(builder2, attrs);
  }
  {
    updatePositioning({
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding,
      avoidCollisions,
      collisionBoundary,
      sameWidth,
      fitViewport
    });
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Popover_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  builder2 = $trigger;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
const Chevrons_up_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m7 15 5 5 5-5" }], ["path", { "d": "m7 9 5-5 5 5" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevrons-up-down" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ChevronsUpDown = Chevrons_up_down;
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "search" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Search$1 = Search;
const Table_caption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<caption${spread(
    [
      {
        class: escape_attribute_value(cn("mt-4 text-sm text-muted-foreground", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</caption>`;
});
const SCORE_CONTINUE_MATCH = 1, SCORE_SPACE_WORD_JUMP = 0.9, SCORE_NON_SPACE_WORD_JUMP = 0.8, SCORE_CHARACTER_JUMP = 0.17, SCORE_TRANSPOSITION = 0.1, PENALTY_SKIPPED = 0.999, PENALTY_CASE_MISMATCH = 0.9999, PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/, COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g, IS_SPACE_REGEXP = /[\s-]/, COUNT_SPACE_REGEXP = /[\s-]/g;
function commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length) {
      return SCORE_CONTINUE_MATCH;
    }
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0) {
    return memoizedResults[memoizeKey];
  }
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, transposedScore, wordBreaks, spaceBreaks;
  while (index >= 0) {
    score = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, wordBreaks.length);
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, spaceBreaks.length);
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && // allow duplicate letters. Ref #7428
    lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
function commandScore(string, abbreviation) {
  return commandScoreInner(string, abbreviation, formatInput(string), formatInput(abbreviation), 0, 0, {});
}
const isBrowser = typeof document !== "undefined";
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isHTMLInputElement(element) {
  return element instanceof HTMLInputElement;
}
function isUndefined(value) {
  return value === void 0;
}
function generateId() {
  return nanoid(10);
}
const kbd$1 = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*"
};
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function styleToString$2(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0"
};
function addEventListener$1(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
const NAME$m = "Command";
const STATE_NAME = "CommandState";
const GROUP_NAME = "CommandGroup";
const LIST_SELECTOR = `[data-cmdk-list-sizer]`;
const GROUP_SELECTOR = `[data-cmdk-group]`;
const GROUP_ITEMS_SELECTOR = `[data-cmdk-group-items]`;
const GROUP_HEADING_SELECTOR = `[data-cmdk-group-heading]`;
const ITEM_SELECTOR = `[data-cmdk-item]`;
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
const VALUE_ATTR = `data-value`;
const defaultFilter = (value, search) => commandScore(value, search);
function getCtx() {
  return getContext(NAME$m);
}
function getState() {
  return getContext(STATE_NAME);
}
function createGroup(alwaysRender) {
  const id = generateId();
  setContext(GROUP_NAME, {
    id,
    alwaysRender: isUndefined(alwaysRender) ? false : alwaysRender
  });
  return { id };
}
function getGroup() {
  const context = getContext(GROUP_NAME);
  if (!context)
    return void 0;
  return context;
}
function createState(initialValues) {
  const defaultState = {
    search: "",
    value: "",
    filtered: {
      count: 0,
      items: /* @__PURE__ */ new Map(),
      groups: /* @__PURE__ */ new Set()
    }
  };
  const state = writable(initialValues ? { ...defaultState, ...removeUndefined(initialValues) } : defaultState);
  return state;
}
const defaults = {
  label: "Command menu",
  shouldFilter: true,
  loop: false,
  onValueChange: void 0,
  value: void 0,
  filter: defaultFilter,
  ids: {
    root: generateId(),
    list: generateId(),
    label: generateId(),
    input: generateId()
  }
};
function createCommand(props) {
  const ids = {
    root: generateId(),
    list: generateId(),
    label: generateId(),
    input: generateId(),
    ...props.ids
  };
  const withDefaults = {
    ...defaults,
    ...removeUndefined(props)
  };
  const state = props.state ?? createState({
    value: withDefaults.value
  });
  const allItems = writable(/* @__PURE__ */ new Set());
  const allGroups = writable(/* @__PURE__ */ new Map());
  const allIds = writable(/* @__PURE__ */ new Map());
  const commandEl = writable(null);
  const options = toWritableStores(omit(withDefaults, "value", "ids"));
  const { shouldFilter, loop, filter, label } = options;
  const context = {
    value: (id, value) => {
      if (value !== get_store_value(allIds).get(id)) {
        allIds.update(($allIds) => {
          $allIds.set(id, value);
          return $allIds;
        });
        state.update(($state) => {
          $state.filtered.items.set(id, score(value, $state.search));
          const sortedState = sort($state, get_store_value(shouldFilter));
          return sortedState;
        });
      }
    },
    // Track item lifecycle (add/remove)
    item: (id, groupId) => {
      allItems.update(($allItems) => $allItems.add(id));
      if (groupId) {
        allGroups.update(($allGroups) => {
          if (!$allGroups.has(groupId)) {
            $allGroups.set(groupId, /* @__PURE__ */ new Set([id]));
          } else {
            $allGroups.get(groupId)?.add(id);
          }
          return $allGroups;
        });
      }
      state.update(($state) => {
        const $shouldFilter = get_store_value(shouldFilter);
        const filteredState = filterItems($state, $shouldFilter);
        const sortedState = sort(filteredState, $shouldFilter);
        if (!sortedState.value) {
          const value = selectFirstItem();
          sortedState.value = value ?? "";
        }
        return sortedState;
      });
      return () => {
        allIds.update(($allIds) => {
          $allIds.delete(id);
          return $allIds;
        });
        allItems.update(($allItems) => {
          $allItems.delete(id);
          return $allItems;
        });
        state.update(($state) => {
          $state.filtered.items.delete(id);
          const selectedItem = getSelectedItem();
          const filteredState = filterItems($state);
          if (selectedItem?.getAttribute("id") === id) {
            filteredState.value = selectFirstItem() ?? "";
          }
          return $state;
        });
      };
    },
    group: (id) => {
      allGroups.update(($allGroups) => {
        if (!$allGroups.has(id)) {
          $allGroups.set(id, /* @__PURE__ */ new Set());
        }
        return $allGroups;
      });
      return () => {
        allIds.update(($allIds) => {
          $allIds.delete(id);
          return $allIds;
        });
        allGroups.update(($allGroups) => {
          $allGroups.delete(id);
          return $allGroups;
        });
      };
    },
    filter: () => {
      return get_store_value(shouldFilter);
    },
    label: get_store_value(label) || props["aria-label"] || "",
    commandEl,
    ids,
    updateState
  };
  function updateState(key, value, preventScroll) {
    const $shouldFilter = get_store_value(shouldFilter);
    state.update((curr) => {
      if (Object.is(curr[key], value))
        return curr;
      curr[key] = value;
      if (key === "search") {
        const filteredState = filterItems(curr, $shouldFilter);
        curr = filteredState;
        const sortedState = sort(curr, $shouldFilter);
        curr = sortedState;
        tick().then(() => state.update((curr2) => {
          curr2.value = selectFirstItem() ?? "";
          return curr2;
        }));
      } else if (key === "value") {
        props.onValueChange?.(curr.value);
        if (!preventScroll) {
          tick().then(() => scrollSelectedIntoView());
        }
      }
      return curr;
    });
  }
  function filterItems(state2, shouldFilterVal) {
    const $shouldFilter = shouldFilterVal ?? get_store_value(shouldFilter);
    const $allItems = get_store_value(allItems);
    const $allIds = get_store_value(allIds);
    if (!state2.search || !$shouldFilter) {
      state2.filtered.count = $allItems.size;
      return state2;
    }
    state2.filtered.groups = /* @__PURE__ */ new Set();
    let itemCount = 0;
    for (const id of $allItems) {
      const value = $allIds.get(id);
      const rank = score(value, state2.search);
      state2.filtered.items.set(id, rank);
      if (rank > 0) {
        itemCount++;
      }
    }
    for (const [groupId, group] of get_store_value(allGroups)) {
      for (const itemId of group) {
        const rank = state2.filtered.items.get(itemId);
        if (rank && rank > 0) {
          state2.filtered.groups.add(groupId);
        }
      }
    }
    state2.filtered.count = itemCount;
    return state2;
  }
  function sort(state2, shouldFilterVal) {
    const $shouldFilter = shouldFilterVal ?? get_store_value(shouldFilter);
    if (!state2.search || !$shouldFilter) {
      return state2;
    }
    const scores = state2.filtered.items;
    const groups = [];
    const $allGroups = get_store_value(allGroups);
    state2.filtered.groups.forEach((value) => {
      const items = $allGroups.get(value);
      if (!items)
        return;
      let max = 0;
      items.forEach((item) => {
        const score2 = scores.get(item);
        if (isUndefined(score2))
          return;
        max = Math.max(score2, max);
      });
      groups.push([value, max]);
    });
    const rootEl = document.getElementById(ids.root);
    if (!rootEl)
      return state2;
    const list = rootEl.querySelector(LIST_SELECTOR);
    getValidItems(rootEl).sort((a, b) => {
      const valueA = a.getAttribute(VALUE_ATTR) ?? "";
      const valueB = b.getAttribute(VALUE_ATTR) ?? "";
      return (scores.get(valueA) ?? 0) - (scores.get(valueB) ?? 0);
    }).forEach((item) => {
      const group = item.closest(GROUP_ITEMS_SELECTOR);
      const closest = item.closest(`${GROUP_ITEMS_SELECTOR} > *`);
      if (isHTMLElement(group)) {
        if (item.parentElement === group) {
          group.appendChild(item);
        } else {
          if (!isHTMLElement(closest))
            return;
          group.appendChild(closest);
        }
      } else {
        if (!isHTMLElement(list))
          return;
        if (item.parentElement === list) {
          list.appendChild(item);
        } else {
          if (!isHTMLElement(closest))
            return;
          list.appendChild(closest);
        }
      }
    });
    groups.sort((a, b) => b[1] - a[1]).forEach((group) => {
      const el = rootEl.querySelector(`${GROUP_SELECTOR}[${VALUE_ATTR}="${group[0]}"]`);
      if (!isHTMLElement(el))
        return;
      el.parentElement?.appendChild(el);
    });
    return state2;
  }
  function selectFirstItem() {
    const item = getValidItems().find((item2) => !item2.ariaDisabled);
    if (!item)
      return;
    const value = item.getAttribute(VALUE_ATTR);
    if (!value)
      return;
    return value;
  }
  function score(value, search) {
    const lowerCaseAndTrimmedValue = value?.toLowerCase().trim();
    const filterFn = get_store_value(filter);
    if (!filterFn) {
      return lowerCaseAndTrimmedValue ? defaultFilter(lowerCaseAndTrimmedValue, search) : 0;
    }
    return lowerCaseAndTrimmedValue ? filterFn(lowerCaseAndTrimmedValue, search) : 0;
  }
  function scrollSelectedIntoView() {
    const item = getSelectedItem();
    if (!item) {
      return;
    }
    if (item.parentElement?.firstChild === item) {
      tick().then(() => item.closest(GROUP_SELECTOR)?.querySelector(GROUP_HEADING_SELECTOR)?.scrollIntoView({
        block: "nearest"
      }));
    }
    tick().then(() => item.scrollIntoView({ block: "nearest" }));
  }
  function getValidItems(rootElement) {
    const rootEl = rootElement ?? document.getElementById(ids.root);
    if (!rootEl)
      return [];
    return Array.from(rootEl.querySelectorAll(VALID_ITEM_SELECTOR)).filter((el) => isHTMLElement(el));
  }
  function getSelectedItem(rootElement) {
    const rootEl = rootElement ?? document.getElementById(ids.root);
    if (!rootEl)
      return;
    const selectedEl = rootEl.querySelector(`${VALID_ITEM_SELECTOR}[aria-selected="true"]`);
    if (!isHTMLElement(selectedEl))
      return null;
    return selectedEl;
  }
  function updateSelectedToIndex(index) {
    const rootEl = document.getElementById(ids.root);
    if (!rootEl)
      return;
    const items = getValidItems(rootEl);
    const item = items[index];
    if (!item)
      return;
  }
  function updateSelectedByChange(change) {
    const selected = getSelectedItem();
    const items = getValidItems();
    const index = items.findIndex((item) => item === selected);
    let newSelected = items[index + change];
    if (get_store_value(loop)) {
      if (index + change < 0) {
        newSelected = items[items.length - 1];
      } else if (index + change === items.length) {
        newSelected = items[0];
      } else {
        newSelected = items[index + change];
      }
    }
    if (newSelected) {
      updateState("value", newSelected.getAttribute(VALUE_ATTR) ?? "");
    }
  }
  function updateSelectedToGroup(change) {
    const selected = getSelectedItem();
    let group = selected?.closest(GROUP_SELECTOR);
    let item = void 0;
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR);
      item = group?.querySelector(VALID_ITEM_SELECTOR);
    }
    if (item) {
      updateState("value", item.getAttribute(VALUE_ATTR) ?? "");
    } else {
      updateSelectedByChange(change);
    }
  }
  function last() {
    return updateSelectedToIndex(getValidItems().length - 1);
  }
  function next(e) {
    e.preventDefault();
    if (e.metaKey) {
      last();
    } else if (e.altKey) {
      updateSelectedToGroup(1);
    } else {
      updateSelectedByChange(1);
    }
  }
  function prev(e) {
    e.preventDefault();
    if (e.metaKey) {
      updateSelectedToIndex(0);
    } else if (e.altKey) {
      updateSelectedToGroup(-1);
    } else {
      updateSelectedByChange(-1);
    }
  }
  function handleRootKeydown(e) {
    switch (e.key) {
      case kbd$1.ARROW_DOWN:
        next(e);
        break;
      case kbd$1.ARROW_UP:
        prev(e);
        break;
      case kbd$1.HOME:
        e.preventDefault();
        updateSelectedToIndex(0);
        break;
      case kbd$1.END:
        e.preventDefault();
        last();
        break;
      case kbd$1.ENTER: {
        e.preventDefault();
        const item = getSelectedItem();
        if (item) {
          item.click();
        }
      }
    }
  }
  setContext(NAME$m, context);
  const stateStore = {
    subscribe: state.subscribe,
    update: state.update,
    set: state.set,
    updateState
  };
  setContext(STATE_NAME, stateStore);
  return {
    state: stateStore,
    handleRootKeydown,
    commandEl,
    ids
  };
}
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.previousElementSibling;
  }
}
const Command$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let slotProps;
  let $$restProps = compute_rest_props($$props, [
    "label",
    "shouldFilter",
    "filter",
    "value",
    "onValueChange",
    "loop",
    "onKeydown",
    "state",
    "ids",
    "asChild"
  ]);
  let $stateStore, $$unsubscribe_stateStore;
  let { label = void 0 } = $$props;
  let { shouldFilter = true } = $$props;
  let { filter = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { onKeydown = void 0 } = $$props;
  let { state = void 0 } = $$props;
  let { ids = void 0 } = $$props;
  let { asChild = false } = $$props;
  const { commandEl, handleRootKeydown, ids: commandIds, state: stateStore } = createCommand({
    label,
    shouldFilter,
    filter,
    value,
    onValueChange: (next) => {
      if (next !== value) {
        value = next;
        onValueChange?.(next);
      }
    },
    loop,
    state,
    ids
  });
  $$unsubscribe_stateStore = subscribe(stateStore, (value2) => $stateStore = value2);
  function syncValueAndState(value2) {
    if (value2 && value2 !== $stateStore.value) {
      set_store_value(stateStore, $stateStore.value = value2, $stateStore);
    }
  }
  function rootAction(node) {
    commandEl.set(node);
    const unsubEvents = executeCallbacks(addEventListener$1(node, "keydown", handleKeydown));
    return { destroy: unsubEvents };
  }
  const rootAttrs = {
    role: "application",
    id: commandIds.root,
    "data-cmdk-root": ""
  };
  const labelAttrs = {
    "data-cmdk-label": "",
    for: commandIds.input,
    id: commandIds.label,
    style: styleToString$2(srOnlyStyles)
  };
  function handleKeydown(e) {
    onKeydown?.(e);
    if (e.defaultPrevented)
      return;
    handleRootKeydown(e);
  }
  const root = { action: rootAction, attrs: rootAttrs };
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.shouldFilter === void 0 && $$bindings.shouldFilter && shouldFilter !== void 0)
    $$bindings.shouldFilter(shouldFilter);
  if ($$props.filter === void 0 && $$bindings.filter && filter !== void 0)
    $$bindings.filter(filter);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0)
    $$bindings.onValueChange(onValueChange);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0)
    $$bindings.loop(loop);
  if ($$props.onKeydown === void 0 && $$bindings.onKeydown && onKeydown !== void 0)
    $$bindings.onKeydown(onKeydown);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  if ($$props.ids === void 0 && $$bindings.ids && ids !== void 0)
    $$bindings.ids(ids);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  {
    syncValueAndState(value);
  }
  slotProps = {
    root,
    label: { attrs: labelAttrs },
    stateStore,
    state: $stateStore
  };
  $$unsubscribe_stateStore();
  return `${asChild ? `${slots.default ? slots.default({ ...slotProps }) : ``}` : `<div${spread([escape_object(rootAttrs), escape_object($$restProps)], {})}> <label${spread([escape_object(labelAttrs)], {})}>${escape(label ?? "")}</label> ${slots.default ? slots.default({ ...slotProps }) : ``}</div>`}`;
});
function styleToString$1(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
({
  type: "hidden",
  "aria-hidden": true,
  hidden: true,
  tabIndex: -1,
  style: styleToString$1({
    position: "absolute",
    opacity: 0,
    "pointer-events": "none",
    margin: 0,
    transform: "translateX(-100%)"
  })
});
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
const kbd = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*",
  A: "a",
  P: "p"
};
readable(void 0, (set) => {
  function clicked(event) {
    set(event);
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "pointerup", clicked, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
readable(void 0, (set) => {
  function keydown(event) {
    if (event && event.key === kbd.ESCAPE) {
      set(event);
    }
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-bits-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
styleToString({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0"
});
styleToString({
  position: "absolute",
  width: "25px",
  height: "25px",
  opacity: "0",
  margin: "0px",
  pointerEvents: "none",
  transform: "translateX(-100%)"
});
const NAME$l = "accordion";
const PARTS$l = ["root", "content", "header", "item", "trigger"];
createBitAttrs(NAME$l, PARTS$l);
const NAME$k = "alert-dialog";
const PARTS$k = [
  "action",
  "cancel",
  "content",
  "description",
  "overlay",
  "portal",
  "title",
  "trigger"
];
createBitAttrs(NAME$k, PARTS$k);
const NAME$j = "avatar";
const PARTS$j = ["root", "image", "fallback"];
createBitAttrs(NAME$j, PARTS$j);
const NAME$i = "checkbox";
const PARTS$i = ["root", "input", "indicator"];
createBitAttrs(NAME$i, PARTS$i);
const NAME$h = "collapsible";
const PARTS$h = ["root", "content", "trigger"];
createBitAttrs(NAME$h, PARTS$h);
const NAME$g = "context-menu";
const PARTS$g = [
  "arrow",
  "checkbox-indicator",
  "checkbox-item",
  "content",
  "group",
  "item",
  "label",
  "radio-group",
  "radio-item",
  "separator",
  "sub-content",
  "sub-trigger",
  "trigger"
];
createBitAttrs(NAME$g, PARTS$g);
const NAME$f = "dialog";
const PARTS$f = ["close", "content", "description", "overlay", "portal", "title", "trigger"];
createBitAttrs(NAME$f, PARTS$f);
const NAME$e = "dropdown-menu";
const PARTS$e = [
  "arrow",
  "checkbox-indicator",
  "checkbox-item",
  "content",
  "group",
  "item",
  "label",
  "radio-group",
  "radio-item",
  "separator",
  "sub-content",
  "sub-trigger",
  "trigger"
];
createBitAttrs(NAME$e, PARTS$e);
const NAME$d = "link-preview";
const PARTS$d = ["arrow", "content", "trigger"];
createBitAttrs(NAME$d, PARTS$d);
const NAME$c = "label";
const PARTS$c = ["root"];
createBitAttrs(NAME$c, PARTS$c);
const NAME$b = "menubar";
const PARTS$b = [
  "root",
  "arrow",
  "checkbox-indicator",
  "checkbox-item",
  "content",
  "group",
  "item",
  "label",
  "radio-group",
  "radio-item",
  "separator",
  "sub-content",
  "sub-trigger",
  "trigger"
];
createBitAttrs(NAME$b, PARTS$b);
const NAME$a = "popover";
const PARTS$a = ["arrow", "close", "content", "trigger"];
createBitAttrs(NAME$a, PARTS$a);
const NAME$9 = "progress";
const PARTS$9 = ["root"];
createBitAttrs(NAME$9, PARTS$9);
const NAME$8 = "radio-group";
const PARTS$8 = ["root", "item", "input"];
createBitAttrs(NAME$8, PARTS$8);
const NAME$7 = "select";
const PARTS$7 = ["arrow", "content", "group", "item", "input", "label", "trigger", "value"];
createBitAttrs(NAME$7, PARTS$7);
const NAME$6 = "separator";
const PARTS$6 = ["root"];
createBitAttrs(NAME$6, PARTS$6);
const NAME$5 = "slider";
const PARTS$5 = ["root", "input", "range", "thumb", "tick"];
createBitAttrs(NAME$5, PARTS$5);
const NAME$4 = "switch";
const PARTS$4 = ["root", "input", "thumb"];
createBitAttrs(NAME$4, PARTS$4);
const NAME$3 = "tabs";
const PARTS$3 = ["root", "content", "list", "trigger"];
createBitAttrs(NAME$3, PARTS$3);
const NAME$2 = "toggle";
const PARTS$2 = ["root", "input"];
createBitAttrs(NAME$2, PARTS$2);
const NAME$1 = "toggle-group";
const PARTS$1 = ["root", "item"];
createBitAttrs(NAME$1, PARTS$1);
const NAME = "tooltip";
const PARTS = ["arrow", "content", "trigger"];
createBitAttrs(NAME, PARTS);
const CommandEmpty = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  compute_rest_props($$props, ["asChild"]);
  let $state, $$unsubscribe_state;
  let { asChild = false } = $$props;
  const state = getState();
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $state.filtered.count === 0;
  $$unsubscribe_state();
  return `${``}`;
});
const CommandGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let containerAttrs;
  let groupAttrs;
  let container;
  let group;
  let $$restProps = compute_rest_props($$props, ["heading", "value", "alwaysRender", "asChild"]);
  let $render, $$unsubscribe_render;
  let { heading = void 0 } = $$props;
  let { value = "" } = $$props;
  let { alwaysRender = false } = $$props;
  let { asChild = false } = $$props;
  const { id } = createGroup(alwaysRender);
  const context = getCtx();
  const state = getState();
  const headingId = generateId();
  const render = derived(state, ($state) => {
    if (alwaysRender)
      return true;
    if (context.filter() === false)
      return true;
    if (!$state.search)
      return true;
    return $state.filtered.groups.has(id);
  });
  $$unsubscribe_render = subscribe(render, (value2) => $render = value2);
  function containerAction(node) {
    if (value) {
      context.value(id, value);
      node.setAttribute(VALUE_ATTR, value);
      return;
    }
    if (heading) {
      value = heading.trim().toLowerCase();
    } else if (node.textContent) {
      value = node.textContent.trim().toLowerCase();
    }
    context.value(id, value);
    node.setAttribute(VALUE_ATTR, value);
  }
  const headingAttrs = {
    "data-cmdk-group-heading": "",
    "aria-hidden": true,
    id: headingId
  };
  if ($$props.heading === void 0 && $$bindings.heading && heading !== void 0)
    $$bindings.heading(heading);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.alwaysRender === void 0 && $$bindings.alwaysRender && alwaysRender !== void 0)
    $$bindings.alwaysRender(alwaysRender);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  containerAttrs = {
    "data-cmdk-group": "",
    role: "presentation",
    hidden: $render ? void 0 : true,
    "data-value": value
  };
  groupAttrs = {
    "data-cmdk-group-items": "",
    role: "group",
    "aria-labelledby": heading ? headingId : void 0
  };
  container = {
    action: containerAction,
    attrs: containerAttrs
  };
  group = { attrs: groupAttrs };
  $$unsubscribe_render();
  return `${asChild ? `${slots.default ? slots.default({
    container,
    group,
    heading: { attrs: headingAttrs }
  }) : ``}` : `<div${spread([escape_object(containerAttrs), escape_object($$restProps)], {})}>${heading ? `<div${spread([escape_object(headingAttrs)], {})}>${escape(heading)}</div>` : ``} <div${spread([escape_object(groupAttrs)], {})}>${slots.default ? slots.default({
    container,
    group,
    heading: { attrs: headingAttrs }
  }) : ``}</div></div>`}`;
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const CommandInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["autofocus", "value", "asChild", "el"]);
  let $selectedItemId, $$unsubscribe_selectedItemId;
  let $search, $$unsubscribe_search;
  const { ids, commandEl } = getCtx();
  const state = getState();
  const search = derived(state, ($state) => $state.search);
  $$unsubscribe_search = subscribe(search, (value2) => $search = value2);
  const valueStore = derived(state, ($state) => $state.value);
  let { autofocus = void 0 } = $$props;
  let { value = $search } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const selectedItemId = derived([valueStore, commandEl], ([$value, $commandEl]) => {
    if (!isBrowser)
      return void 0;
    const item = $commandEl?.querySelector(`${ITEM_SELECTOR}[${VALUE_ATTR}="${$value}"]`);
    return item?.getAttribute("id");
  });
  $$unsubscribe_selectedItemId = subscribe(selectedItemId, (value2) => $selectedItemId = value2);
  function handleValueUpdate(v) {
    state.updateState("search", v);
  }
  function action(node) {
    if (autofocus) {
      sleep(10).then(() => node.focus());
    }
    const unsubEvents = addEventListener$1(node, "change", (e) => {
      if (!isHTMLInputElement(e.target))
        return;
      state.updateState("search", e.target.value);
    });
    return { destroy: unsubEvents };
  }
  let attrs;
  if ($$props.autofocus === void 0 && $$bindings.autofocus && autofocus !== void 0)
    $$bindings.autofocus(autofocus);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    handleValueUpdate(value);
  }
  attrs = {
    type: "text",
    "data-cmdk-input": "",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    "aria-autocomplete": "list",
    role: "combobox",
    "aria-expanded": true,
    "aria-controls": ids.list,
    "aria-labelledby": ids.label,
    "aria-activedescendant": $selectedItemId ?? void 0,
    id: ids.input
  };
  $$unsubscribe_selectedItemId();
  $$unsubscribe_search();
  return `${asChild ? `${slots.default ? slots.default({ action, attrs }) : ``}` : `<input${spread([escape_object(attrs), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}${add_attribute("value", value, 0)}>`}`;
});
const CommandItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["disabled", "value", "onSelect", "alwaysRender", "asChild", "id"]);
  let $selected, $$unsubscribe_selected;
  let $render, $$unsubscribe_render;
  let { disabled = false } = $$props;
  let { value = "" } = $$props;
  let { onSelect = void 0 } = $$props;
  let { alwaysRender = false } = $$props;
  let { asChild = false } = $$props;
  let { id = generateId() } = $$props;
  const groupContext = getGroup();
  const context = getCtx();
  const state = getState();
  const trueAlwaysRender = alwaysRender ?? groupContext?.alwaysRender;
  const render = derived(state, ($state) => {
    if (trueAlwaysRender || context.filter() === false || !$state.search)
      return true;
    const currentScore = $state.filtered.items.get(id);
    if (isUndefined(currentScore))
      return false;
    return currentScore > 0;
  });
  $$unsubscribe_render = subscribe(render, (value2) => $render = value2);
  let isFirstRender = true;
  const selected = derived(state, ($state) => $state.value === value);
  $$unsubscribe_selected = subscribe(selected, (value2) => $selected = value2);
  function action(node) {
    if (!value && node.textContent) {
      value = node.textContent.trim().toLowerCase();
    }
    context.value(id, value);
    node.setAttribute(VALUE_ATTR, value);
    const unsubEvents = executeCallbacks(
      addEventListener$1(node, "pointermove", () => {
        if (disabled)
          return;
        select();
      }),
      addEventListener$1(node, "click", () => {
        if (disabled)
          return;
        handleItemClick();
      })
    );
    return {
      destroy() {
        unsubEvents();
      }
    };
  }
  function handleItemClick() {
    select();
    onSelect?.(value);
  }
  function select() {
    state.updateState("value", value, true);
  }
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0)
    $$bindings.onSelect(onSelect);
  if ($$props.alwaysRender === void 0 && $$bindings.alwaysRender && alwaysRender !== void 0)
    $$bindings.alwaysRender(alwaysRender);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  attrs = {
    "aria-disabled": disabled ? true : void 0,
    "aria-selected": $selected ? true : void 0,
    "data-disabled": disabled ? true : void 0,
    "data-selected": $selected ? true : void 0,
    "data-cmdk-item": "",
    "data-value": value,
    role: "option",
    id
  };
  $$unsubscribe_selected();
  $$unsubscribe_render();
  return `${$render || isFirstRender ? `${asChild ? `${slots.default ? slots.default({ action, attrs }) : ``}` : `<div${spread([escape_object(attrs), escape_object($$restProps)], {})}>${slots.default ? slots.default({ action, attrs }) : ``}</div>`}` : ``}`;
});
const Command = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "class"]);
  let { value = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Command$1, "CommandPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)
        },
        $$restProps,
        { value }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Command_empty = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(CommandEmpty, "CommandPrimitive.Empty").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("py-6 text-center text-sm", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Command_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(CommandGroup, "CommandPrimitive.Group").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("overflow-hidden p-1 text-foreground [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Command_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(CommandItem, "CommandPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Command_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex items-center border-b px-2" data-cmdk-input-wrapper="">${validate_component(Search$1, "Search").$$render(
      $$result,
      {
        class: "mr-2 h-4 w-4 shrink-0 opacity-50"
      },
      {},
      {}
    )} ${validate_component(CommandInput, "CommandPrimitive.Input").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)
        },
        $$restProps,
        { value }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Popover_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Popover_content$1, "PopoverPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Root = Popover;
const Trigger = Popover_trigger;
const Combobox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedValue;
  let { options } = $$props;
  let { placeholder } = $$props;
  let open = false;
  let value = "";
  function closeAndFocusTrigger(triggerId) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    selectedValue = options.find((f) => f.value === value)?.label ?? placeholder;
    $$rendered = `${validate_component(Root, "Popover.Root").$$render(
      $$result,
      { open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ids }) => {
          return `${validate_component(Trigger, "Popover.Trigger").$$render($$result, { asChild: true }, {}, {
            default: ({ builder: builder2 }) => {
              return `${validate_component(Button, "Button").$$render(
                $$result,
                {
                  builders: [builder2],
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": open,
                  class: "w-[200px] justify-between"
                },
                {},
                {
                  default: () => {
                    return `${escape(selectedValue)} ${validate_component(ChevronsUpDown, "ChevronsUpDown").$$render(
                      $$result,
                      {
                        class: "ml-2 h-4 w-4 shrink-0 opacity-50"
                      },
                      {},
                      {}
                    )}`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "w-[200px] p-0" }, {}, {
            default: () => {
              return `${validate_component(Command, "Command.Root").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Command_input, "Command.Input").$$render($$result, { placeholder }, {}, {})} ${validate_component(Command_empty, "Command.Empty").$$render($$result, {}, {}, {
                    default: () => {
                      return `No framework found.`;
                    }
                  })} ${validate_component(Command_group, "Command.Group").$$render($$result, {}, {}, {
                    default: () => {
                      return `${each(options, (option) => {
                        return `${validate_component(Command_item, "Command.Item").$$render(
                          $$result,
                          {
                            value: option.value,
                            onSelect: (currentValue) => {
                              value = currentValue;
                              closeAndFocusTrigger(ids.trigger);
                            }
                          },
                          {},
                          {
                            default: () => {
                              return `${validate_component(Check, "Check").$$render(
                                $$result,
                                {
                                  class: cn("mr-2 h-4 w-4", value !== option.value && "text-transparent")
                                },
                                {},
                                {}
                              )} ${escape(option.label)} `;
                            }
                          }
                        )}`;
                      })}`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const PAGE_LENGTH = 10;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let channelOptions;
  let eventOptions;
  let lastEventCreatedAt;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  channelOptions = data.channels.map((channel) => ({ label: `#${channel}`, value: channel }));
  eventOptions = data.eventNames.map((event) => ({ label: event, value: event }));
  lastEventCreatedAt = data.events[PAGE_LENGTH - 1]?.createdAt;
  return `<div>${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center justify-between">${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `Events`;
            }
          })} <div class="flex items-center gap-2">${validate_component(Combobox, "Combobox").$$render(
            $$result,
            {
              placeholder: "Channel",
              options: channelOptions
            },
            {},
            {}
          )} ${validate_component(Combobox, "Combobox").$$render(
            $$result,
            {
              placeholder: "Event",
              options: eventOptions
            },
            {},
            {}
          )}</div></div>`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Table, "Table.Root").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                        default: () => {
                          return `Event`;
                        }
                      })} ${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                        default: () => {
                          return `Channel`;
                        }
                      })} ${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                        default: () => {
                          return `Notify`;
                        }
                      })} ${validate_component(Table_head, "Table.Head").$$render($$result, { class: "text-right" }, {}, {
                        default: () => {
                          return `Created`;
                        }
                      })}`;
                    }
                  })}`;
                }
              })} ${validate_component(Table_body, "Table.Body").$$render($$result, {}, {}, {
                default: () => {
                  return `${each(data.events, (event) => {
                    return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                          default: () => {
                            return `<a${add_attribute("href", `/events/${event.id}`, 0)} class="flex items-center gap-2">${event.emoji ? `${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary", class: "text-lg" }, {}, {
                              default: () => {
                                return `${escape(event.emoji)}`;
                              }
                            })}` : ``} <span>${escape(event.event)}</span></a> `;
                          }
                        })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
                              default: () => {
                                return `#${escape(event.channel)}`;
                              }
                            })} `;
                          }
                        })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
                              default: () => {
                                return `${event.notify === "true" ? `${validate_component(Check, "CheckIcon").$$render($$result, { size: 16 }, {}, {})}` : `${validate_component(XIcon, "XIcon").$$render($$result, { size: 16 }, {}, {})}`} `;
                              }
                            })} `;
                          }
                        })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                          default: () => {
                            return `<div class="flex items-center justify-end gap-2"><span>${escape(formatDate(event.createdAt ?? ""))}</span></div> `;
                          }
                        })} `;
                      }
                    })}`;
                  })}`;
                }
              })} ${lastEventCreatedAt ? `${validate_component(Table_caption, "Table.Caption").$$render($$result, { class: "text-left" }, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render(
                    $$result,
                    {
                      href: `?last_cursor=${lastEventCreatedAt}`,
                      variant: "secondary"
                    },
                    {},
                    {
                      default: () => {
                        return `Next Page`;
                      }
                    }
                  )}`;
                }
              })}` : ``}`;
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
