import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { t as cn } from "./router-Rtc38bRC.js";
function isoToDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}
function digitsToISO(digits) {
  if (digits.length < 8) return "";
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  return `${y}-${m}-${d}`;
}
function formatDisplay(digits) {
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}
function DateInput({
  id,
  value = "",
  onChange,
  className,
  placeholder = "DD/MM/AAAA",
  disabled
}) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));
  const nativeRef = useRef(null);
  useEffect(() => {
    setDisplay(isoToDisplay(value));
  }, [value]);
  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const formatted = formatDisplay(digits);
    setDisplay(formatted);
    if (digits.length === 8) {
      onChange?.(digitsToISO(digits));
    } else {
      onChange?.("");
    }
  }
  function handleNativeChange(e) {
    const iso = e.target.value;
    setDisplay(isoToDisplay(iso));
    onChange?.(iso);
  }
  function openPicker() {
    const el = nativeRef.current;
    if (!el) return;
    try {
      el.showPicker?.();
    } catch {
      el.click();
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        id,
        type: "text",
        inputMode: "numeric",
        value: display,
        onChange: handleChange,
        placeholder,
        disabled,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-background/70 px-3 py-1 pr-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted/35",
          className
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        tabIndex: -1,
        disabled,
        onClick: openPicker,
        className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none",
        children: /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: nativeRef,
        type: "date",
        value,
        onChange: handleNativeChange,
        tabIndex: -1,
        "aria-hidden": "true",
        className: "absolute inset-0 h-full w-full opacity-0 pointer-events-none"
      }
    )
  ] });
}
export {
  DateInput as D
};
