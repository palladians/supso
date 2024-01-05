import { g as get_store_value, s as setContext, b as getContext, c as create_ssr_component, d as compute_rest_props, a as subscribe, f as spread, i as escape_object, j as add_attribute, h as escape_attribute_value, v as validate_component, e as escape, k as each } from "../../../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../../chunks/card-title.js";
import { C as Card_content } from "../../../../../../chunks/card-content.js";
import "clsx";
import "dequal";
import { j as disabledAttr, a as executeCallbacks, b as addMeltEventListener, s as styleToString, i as isHTMLElement, k as kbd, B as Button } from "../../../../../../chunks/index5.js";
import { b as builder, c as createElHelpers, g as getElementByMeltId, a as createBitAttrs, d as createDispatcher } from "../../../../../../chunks/events.js";
import { t as toWritableStores, a as omit, o as overridable, r as removeUndefined, g as getOptionUpdater } from "../../../../../../chunks/updater.js";
import { g as generateIds, t as tick, b as generateId } from "../../../../../../chunks/portal.js";
import { d as derived, w as writable } from "../../../../../../chunks/index2.js";
import { B as Badge } from "../../../../../../chunks/index6.js";
import { c as cn } from "../../../../../../chunks/utils.js";
import { c as currentProjectId } from "../../../../../../chunks/user.js";
import { R as Root$1, A as Alert_dialog_content, a as Alert_dialog_header, b as Alert_dialog_title, c as Alert_dialog_description, d as Alert_dialog_footer, e as Alert_dialog_cancel, f as Alert_dialog_action } from "../../../../../../chunks/index8.js";
import { C as ChevronDown } from "../../../../../../chunks/chevron-down.js";
import { s as slide } from "../../../../../../chunks/index9.js";
import { P as PlusIcon } from "../../../../../../chunks/plus.js";
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const { name: name$1, selector } = createElHelpers("accordion");
const defaults$1 = {
  multiple: false,
  disabled: false,
  forceVisible: false
};
const createAccordion = (props) => {
  const withDefaults = { ...defaults$1, ...props };
  const options = toWritableStores(omit(withDefaults, "value", "onValueChange", "defaultValue"));
  const meltIds = generateIds(["root"]);
  const { disabled, forceVisible } = options;
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  const isSelected = (key, v) => {
    if (v === void 0)
      return false;
    if (typeof v === "string")
      return v === key;
    return v.includes(key);
  };
  const isSelectedStore = derived(value, ($value) => {
    return (key) => isSelected(key, $value);
  });
  const root = builder(name$1(), {
    returned: () => ({
      "data-melt-id": meltIds.root
    })
  });
  const parseItemProps = (props2) => {
    if (typeof props2 === "string") {
      return { value: props2 };
    } else {
      return props2;
    }
  };
  const parseHeadingProps = (props2) => {
    if (typeof props2 === "number") {
      return { level: props2 };
    } else {
      return props2;
    }
  };
  const item = builder(name$1("item"), {
    stores: value,
    returned: ($value) => {
      return (props2) => {
        const { value: itemValue, disabled: disabled2 } = parseItemProps(props2);
        return {
          "data-state": isSelected(itemValue, $value) ? "open" : "closed",
          "data-disabled": disabledAttr(disabled2)
        };
      };
    }
  });
  const trigger = builder(name$1("trigger"), {
    stores: [value, disabled],
    returned: ([$value, $disabled]) => {
      return (props2) => {
        const { value: itemValue, disabled: disabled2 } = parseItemProps(props2);
        return {
          disabled: disabledAttr($disabled || disabled2),
          "aria-expanded": isSelected(itemValue, $value) ? true : false,
          "aria-disabled": disabled2 ? true : false,
          "data-disabled": disabledAttr(disabled2),
          "data-value": itemValue,
          "data-state": isSelected(itemValue, $value) ? "open" : "closed"
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        const disabled2 = node.dataset.disabled === "true";
        const itemValue = node.dataset.value;
        if (disabled2 || !itemValue)
          return;
        handleValueUpdate(itemValue);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
          return;
        }
        e.preventDefault();
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
          const disabled2 = node.dataset.disabled === "true";
          const itemValue = node.dataset.value;
          if (disabled2 || !itemValue)
            return;
          handleValueUpdate(itemValue);
          return;
        }
        const el = e.target;
        const rootEl = getElementByMeltId(meltIds.root);
        if (!rootEl || !isHTMLElement(el))
          return;
        const items = Array.from(rootEl.querySelectorAll(selector("trigger")));
        const candidateItems = items.filter((item2) => {
          if (!isHTMLElement(item2))
            return false;
          return item2.dataset.disabled !== "true";
        });
        if (!candidateItems.length)
          return;
        const elIdx = candidateItems.indexOf(el);
        if (e.key === kbd.ARROW_DOWN) {
          candidateItems[(elIdx + 1) % candidateItems.length].focus();
        }
        if (e.key === kbd.ARROW_UP) {
          candidateItems[(elIdx - 1 + candidateItems.length) % candidateItems.length].focus();
        }
        if (e.key === kbd.HOME) {
          candidateItems[0].focus();
        }
        if (e.key === kbd.END) {
          candidateItems[candidateItems.length - 1].focus();
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const content = builder(name$1("content"), {
    stores: [value, disabled, forceVisible],
    returned: ([$value, $disabled, $forceVisible]) => {
      return (props2) => {
        const { value: itemValue } = parseItemProps(props2);
        const isVisible = isSelected(itemValue, $value) || $forceVisible;
        return {
          "data-state": isVisible ? "open" : "closed",
          "data-disabled": disabledAttr($disabled),
          "data-value": itemValue,
          hidden: isVisible ? void 0 : true,
          style: styleToString({
            display: isVisible ? void 0 : "none"
          })
        };
      };
    },
    action: (node) => {
      tick().then(() => {
        const contentId = generateId();
        const triggerId = generateId();
        const parentTrigger = document.querySelector(`${selector("trigger")}, [data-value="${node.dataset.value}"]`);
        if (!isHTMLElement(parentTrigger))
          return;
        node.id = contentId;
        parentTrigger.setAttribute("aria-controls", contentId);
        parentTrigger.id = triggerId;
      });
    }
  });
  const heading = builder(name$1("heading"), {
    returned: () => {
      return (props2) => {
        const { level } = parseHeadingProps(props2);
        return {
          role: "heading",
          "aria-level": level,
          "data-heading-level": level
        };
      };
    }
  });
  function handleValueUpdate(itemValue) {
    value.update(($value) => {
      if ($value === void 0) {
        return withDefaults.multiple ? [itemValue] : itemValue;
      }
      if (Array.isArray($value)) {
        if ($value.includes(itemValue)) {
          return $value.filter((v) => v !== itemValue);
        }
        $value.push(itemValue);
        return $value;
      }
      return $value === itemValue ? void 0 : itemValue;
    });
  }
  return {
    ids: meltIds,
    elements: {
      root,
      item,
      trigger,
      content,
      heading
    },
    states: {
      value
    },
    helpers: {
      isSelected: isSelectedStore
    },
    options
  };
};
const defaults = {
  defaultChecked: false,
  disabled: false,
  required: false,
  name: "",
  value: ""
};
const { name } = createElHelpers("switch");
function createSwitch(props) {
  const propsWithDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(propsWithDefaults, "checked"));
  const { disabled, required, name: nameStore, value } = options;
  const checkedWritable = propsWithDefaults.checked ?? writable(propsWithDefaults.defaultChecked);
  const checked = overridable(checkedWritable, propsWithDefaults?.onCheckedChange);
  function toggleSwitch() {
    if (get_store_value(disabled))
      return;
    checked.update((prev) => !prev);
  }
  const root = builder(name(), {
    stores: [checked, disabled, required],
    returned: ([$checked, $disabled, $required]) => {
      return {
        "data-disabled": disabledAttr($disabled),
        disabled: disabledAttr($disabled),
        "data-state": $checked ? "checked" : "unchecked",
        type: "button",
        role: "switch",
        "aria-checked": $checked ? "true" : "false",
        "aria-required": $required ? "true" : void 0
      };
    },
    action(node) {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        toggleSwitch();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleSwitch();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const input = builder(name("input"), {
    stores: [checked, nameStore, required, disabled, value],
    returned: ([$checked, $name, $required, $disabled, $value]) => {
      return {
        type: "checkbox",
        "aria-hidden": true,
        hidden: true,
        tabindex: -1,
        name: $name,
        value: $value,
        checked: $checked,
        required: $required,
        disabled: disabledAttr($disabled),
        style: styleToString({
          position: "absolute",
          opacity: 0,
          "pointer-events": "none",
          margin: 0,
          transform: "translateX(-100%)"
        })
      };
    }
  });
  return {
    elements: {
      root,
      input
    },
    states: {
      checked
    },
    options
  };
}
function getAccordionData() {
  const NAME = "accordion";
  const ITEM_NAME = "accordion-item";
  const PARTS = ["root", "content", "header", "item", "trigger"];
  return { NAME, ITEM_NAME, PARTS };
}
function setCtx$1(props) {
  const initAccordion = createAccordion(removeUndefined(props));
  const { NAME, PARTS } = getAccordionData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const accordion = {
    ...initAccordion,
    getAttrs,
    updateOption: getOptionUpdater(initAccordion.options)
  };
  setContext(NAME, accordion);
  return accordion;
}
function getCtx$1() {
  const { NAME } = getAccordionData();
  return getContext(NAME);
}
function setItem(props) {
  const { ITEM_NAME } = getAccordionData();
  setContext(ITEM_NAME, { ...props });
  const ctx = getCtx$1();
  return { ...ctx, props };
}
function getItemProps() {
  const { ITEM_NAME } = getAccordionData();
  return getContext(ITEM_NAME);
}
function getContent() {
  const ctx = getCtx$1();
  const { value: props } = getItemProps();
  return {
    ...ctx,
    props
  };
}
function getTrigger() {
  const ctx = getCtx$1();
  const { value, disabled } = getItemProps();
  return {
    ...ctx,
    props: { value, disabled }
  };
}
const Accordion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["multiple", "value", "onValueChange", "disabled", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { multiple = false } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { disabled = false } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { value: localValue }, updateOption, getAttrs } = setCtx$1({
    multiple,
    disabled,
    defaultValue: value,
    onValueChange: ({ next }) => {
      if (Array.isArray(next)) {
        if (JSON.stringify(next) !== JSON.stringify(value)) {
          onValueChange?.(next);
          value = next;
        }
        return next;
      }
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  const attrs = getAttrs("root");
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0)
    $$bindings.onValueChange(onValueChange);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  value !== void 0 && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localValue.set(Array.isArray(value) ? [...value] : value);
  {
    updateOption("multiple", multiple);
  }
  {
    updateOption("disabled", disabled);
  }
  builder2 = $root;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Accordion_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "asChild", "el"]);
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { item }, props, getAttrs } = setItem({ value, disabled });
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  const attrs = getAttrs("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $item(props);
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_item();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Accordion_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["level", "asChild", "el"]);
  let $header, $$unsubscribe_header;
  let { level = 3 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { heading: header }, getAttrs } = getCtx$1();
  $$unsubscribe_header = subscribe(header, (value) => $header = value);
  const attrs = getAttrs("header");
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $header(level);
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_header();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Accordion_trigger$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, props, getAttrs } = getTrigger();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $trigger(props);
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
const Accordion_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $isSelected, $$unsubscribe_isSelected;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, helpers: { isSelected }, props, getAttrs } = getContent();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
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
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $content(props);
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_isSelected();
  return `${asChild && $isSelected(props) ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $isSelected(props) ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && outTransition && $isSelected(props) ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && $isSelected(props) ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${outTransition && $isSelected(props) ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${$isSelected(props) ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : ``}`}`}`}`}`}`;
});
function getSwitchData() {
  const NAME = "switch";
  const PARTS = ["root", "input", "thumb"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getSwitchData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const Switch2 = { ...createSwitch(removeUndefined(props)), getAttrs };
  setContext(NAME, Switch2);
  return {
    ...Switch2,
    updateOption: getOptionUpdater(Switch2.options)
  };
}
function getCtx() {
  const { NAME } = getSwitchData();
  return getContext(NAME);
}
const Switch_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let inputValue;
  let $$restProps = compute_rest_props($$props, ["el"]);
  let $value, $$unsubscribe_value;
  let $input, $$unsubscribe_input;
  let $name, $$unsubscribe_name;
  let $disabled, $$unsubscribe_disabled;
  let $required, $$unsubscribe_required;
  let { el = void 0 } = $$props;
  const { elements: { input }, options: { value, name: name2, disabled, required } } = getCtx();
  $$unsubscribe_input = subscribe(input, (value2) => $input = value2);
  $$unsubscribe_value = subscribe(value, (value2) => $value = value2);
  $$unsubscribe_name = subscribe(name2, (value2) => $name = value2);
  $$unsubscribe_disabled = subscribe(disabled, (value2) => $disabled = value2);
  $$unsubscribe_required = subscribe(required, (value2) => $required = value2);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  inputValue = $value === void 0 || $value === "" ? "on" : $value;
  $$unsubscribe_value();
  $$unsubscribe_input();
  $$unsubscribe_name();
  $$unsubscribe_disabled();
  $$unsubscribe_required();
  return `<input${spread(
    [
      escape_object($input),
      { name: escape_attribute_value($name) },
      { disabled: $disabled || null },
      { required: $required || null },
      {
        value: escape_attribute_value(inputValue)
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>`;
});
const { Object: Object_1 } = globals;
const Switch$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let attrs;
  let $$restProps = compute_rest_props($$props, [
    "checked",
    "onCheckedChange",
    "disabled",
    "name",
    "value",
    "includeInput",
    "required",
    "asChild",
    "inputAttrs",
    "el"
  ]);
  let $root, $$unsubscribe_root;
  let { checked = void 0 } = $$props;
  let { onCheckedChange = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { name: name2 = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { includeInput = true } = $$props;
  let { required = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { inputAttrs = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { checked: localChecked }, updateOption, getAttrs } = setCtx({
    disabled,
    name: name2,
    value,
    required,
    defaultChecked: checked,
    onCheckedChange: ({ next }) => {
      if (checked !== next) {
        onCheckedChange?.(next);
        checked = next;
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  createDispatcher();
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.onCheckedChange === void 0 && $$bindings.onCheckedChange && onCheckedChange !== void 0)
    $$bindings.onCheckedChange(onCheckedChange);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.name === void 0 && $$bindings.name && name2 !== void 0)
    $$bindings.name(name2);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.includeInput === void 0 && $$bindings.includeInput && includeInput !== void 0)
    $$bindings.includeInput(includeInput);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.inputAttrs === void 0 && $$bindings.inputAttrs && inputAttrs !== void 0)
    $$bindings.inputAttrs(inputAttrs);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  checked !== void 0 && localChecked.set(checked);
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("name", name2);
  }
  {
    updateOption("value", value);
  }
  {
    updateOption("required", required);
  }
  builder2 = $root;
  attrs = {
    ...getAttrs("root"),
    "data-checked": checked ? "" : void 0
  };
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`} ${includeInput ? `${validate_component(Switch_input, "SwitchInput").$$render($$result, Object_1.assign({}, inputAttrs), {}, {})}` : ``}`;
});
const Switch_thumb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $checked, $$unsubscribe_checked;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { checked }, getAttrs } = getCtx();
  $$unsubscribe_checked = subscribe(checked, (value) => $checked = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  attrs = {
    ...getAttrs("thumb"),
    "data-state": $checked ? "checked" : "unchecked",
    "data-checked": $checked ? "" : void 0
  };
  $$unsubscribe_checked();
  return `${asChild ? `${slots.default ? slots.default({ attrs, checked: $checked }) : ``}` : `<span${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}></span>`}`;
});
const Accordion_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = slide } = $$props;
  let { transitionConfig = { duration: 200 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Accordion_content$1, "AccordionPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("overflow-hidden text-sm transition-all", className)
      },
      { transition },
      { transitionConfig },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="pb-4 pt-0">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}`;
});
const Accordion_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `${validate_component(Accordion_item$1, "AccordionPrimitive.Item").$$render($$result, Object.assign({}, { value }, { class: cn("border-b", className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Accordion_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "level"]);
  let { class: className = void 0 } = $$props;
  let { level = 3 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  return `${validate_component(Accordion_header, "AccordionPrimitive.Header").$$render($$result, { level, class: "flex" }, {}, {
    default: () => {
      return `${validate_component(Accordion_trigger$1, "AccordionPrimitive.Trigger").$$render(
        $$result,
        Object.assign(
          {},
          {
            class: cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `${slots.default ? slots.default({}) : ``} ${validate_component(ChevronDown, "ChevronDown").$$render(
              $$result,
              {
                class: "h-4 w-4 transition-transform duration-200"
              },
              {},
              {}
            )}`;
          }
        }
      )}`;
    }
  })}`;
});
const Root = Accordion;
const Switch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "checked"]);
  let { class: className = void 0 } = $$props;
  let { checked = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Switch$1, "SwitchPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className)
        },
        $$restProps,
        { checked }
      ),
      {
        checked: ($$value) => {
          checked = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Switch_thumb, "SwitchPrimitive.Thumb").$$render(
            $$result,
            {
              class: cn("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
            },
            {},
            {}
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Delete_flag_alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
                    return `This action cannot be undone. This will permanently delete the feature flag. If any app
				relies on this flag, it may get broken.`;
                  }
                })}`;
              }
            })} ${validate_component(Alert_dialog_footer, "AlertDialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Alert_dialog_cancel, "AlertDialog.Cancel").$$render($$result, {}, {}, {
                  default: () => {
                    return `Cancel`;
                  }
                })} <form action="?/deleteFlag" method="POST"><input type="hidden" name="id"${add_attribute("value", $open, 0)}> ${validate_component(Alert_dialog_action, "AlertDialog.Action").$$render($$result, { type: "submit" }, {}, {
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
  let currentProject;
  let $currentProjectId, $$unsubscribe_currentProjectId;
  $$unsubscribe_currentProjectId = subscribe(currentProjectId, (value) => $currentProjectId = value);
  let { data } = $$props;
  const deleteFlagAlertId = writable(null);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.deleteFlagAlertId === void 0 && $$bindings.deleteFlagAlertId && deleteFlagAlertId !== void 0)
    $$bindings.deleteFlagAlertId(deleteFlagAlertId);
  currentProject = data.projects.find((project) => project.id === $currentProjectId);
  $$unsubscribe_currentProjectId();
  return `<div class="flex flex-1 items-center justify-center">${validate_component(Delete_flag_alert, "DeleteFlagAlert").$$render($$result, { open: deleteFlagAlertId }, {}, {})} ${validate_component(Card, "Card.Root").$$render($$result, { class: "w-full max-w-[32rem]" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center justify-between">${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
            default: () => {
              return `${escape(currentProject?.name)} Feature Flags`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              href: `/projects/${$currentProjectId}/flags/create`,
              variant: "secondary",
              size: "sm",
              class: "gap-1"
            },
            {},
            {
              default: () => {
                return `${validate_component(PlusIcon, "PlusIcon").$$render($$result, { size: 16 }, {}, {})} <span data-svelte-h="svelte-pekjo0">Create Flag</span>`;
              }
            }
          )}</div>`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Root, "Accordion.Root").$$render($$result, {}, {}, {
            default: () => {
              return `${each(data.featureFlags, (featureFlag) => {
                return `${validate_component(Accordion_item, "Accordion.Item").$$render($$result, { value: featureFlag.id }, {}, {
                  default: () => {
                    return `${validate_component(Accordion_trigger, "Accordion.Trigger").$$render($$result, {}, {}, {
                      default: () => {
                        return `<div class="flex gap-2">${validate_component(Badge, "Badge").$$render(
                          $$result,
                          {
                            variant: featureFlag.enabled === "true" ? "default" : "secondary"
                          },
                          {},
                          {
                            default: () => {
                              return `${escape(featureFlag.enabled === "true" ? "On" : "Off")}`;
                            }
                          }
                        )} <span>${escape(featureFlag.name)}</span></div> `;
                      }
                    })} ${validate_component(Accordion_content, "Accordion.Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `<div class="flex flex-col gap-2">${featureFlag.description ? `<p>${escape(featureFlag.description)} </p>` : ``} <div class="flex items-center justify-between"><div class="flex items-center gap-4">${validate_component(Button, "Button").$$render(
                          $$result,
                          {
                            href: `/projects/${$currentProjectId}/flags/${featureFlag.id}`,
                            variant: "link",
                            class: "p-0"
                          },
                          {},
                          {
                            default: () => {
                              return `Edit`;
                            }
                          }
                        )} ${validate_component(Button, "Button").$$render($$result, { variant: "link", class: "p-0" }, {}, {
                          default: () => {
                            return `Delete`;
                          }
                        })}</div> <form method="POST" action="?/toggleFlag"><input type="hidden" name="flagId"${add_attribute("value", featureFlag.id, 0)}> ${validate_component(Switch, "Switch").$$render(
                          $$result,
                          {
                            type: "submit",
                            checked: featureFlag.enabled === "true"
                          },
                          {},
                          {}
                        )}</form> </div></div> `;
                      }
                    })} `;
                  }
                })}`;
              })}`;
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
