import { useState, useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { c as TableHead } from "./table-DqzdP08c.js";
function cmp(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  const sa = String(a);
  const sb = String(b);
  if (/^\d{4}-\d{2}-\d{2}/.test(sa) && /^\d{4}-\d{2}-\d{2}/.test(sb)) {
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  }
  return sa.localeCompare(sb, "es", { sensitivity: "base", numeric: true });
}
function useSortable(items) {
  const [col, setCol] = useState(null);
  const [dir, setDir] = useState("asc");
  const sorted = useMemo(() => {
    if (!col) return items;
    return [...items].sort((a, b) => {
      const row = a;
      const rowB = b;
      const result = cmp(row[col], rowB[col]);
      return dir === "asc" ? result : -result;
    });
  }, [items, col, dir]);
  function toggle(key) {
    if (col === key) setDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setCol(key);
      setDir("asc");
    }
  }
  return { sorted, col, dir, toggle };
}
function SortHead({ label, sortKey, col, dir, onSort, className }) {
  const active = col === sortKey;
  return /* @__PURE__ */ jsx(
    TableHead,
    {
      className: `cursor-pointer select-none ${className ?? ""}`,
      onClick: () => onSort(sortKey),
      children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
        label,
        active ? dir === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsx(ChevronsUpDown, { className: "h-3 w-3 shrink-0 opacity-30" })
      ] })
    }
  );
}
export {
  SortHead as S,
  useSortable as u
};
