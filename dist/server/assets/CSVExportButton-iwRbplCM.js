import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import { B as Button } from "./router-Rtc38bRC.js";
function escapeCSV(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
function CSVExportButton({
  data,
  columns,
  filename,
  label = "Export CSV"
}) {
  const [loading, setLoading] = useState(false);
  const handleExport = useCallback(() => {
    setLoading(true);
    try {
      const header = columns.map((c) => escapeCSV(c.header)).join(",");
      const rows = data.map(
        (row) => columns.map((c) => escapeCSV(c.accessor(row))).join(",")
      );
      const csv = [header, ...rows].join("\n");
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }, [data, columns, filename]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: handleExport,
      disabled: loading || data.length === 0,
      children: [
        /* @__PURE__ */ jsx(Download, { className: "mr-1.5 h-4 w-4" }),
        loading ? "Exporting…" : label
      ]
    }
  );
}
export {
  CSVExportButton as C
};
