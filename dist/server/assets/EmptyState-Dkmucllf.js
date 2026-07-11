import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button, t as cn } from "./router-Rtc38bRC.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col items-center justify-center py-16 px-4 text-center", className), children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-12 w-12 text-muted-foreground/50 mb-4", strokeWidth: 1.5 }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: description }),
    (actionLabel || secondaryActionLabel) && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3", children: [
      actionLabel && onAction && /* @__PURE__ */ jsx(Button, { onClick: onAction, children: actionLabel }),
      secondaryActionLabel && onSecondaryAction && /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onSecondaryAction, children: secondaryActionLabel })
    ] })
  ] });
}
export {
  EmptyState as E
};
