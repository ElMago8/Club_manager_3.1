import { jsx } from "react/jsx-runtime";
import { Navigate } from "@tanstack/react-router";
function AppIndex() {
  return /* @__PURE__ */ jsx(Navigate, { to: "/app/dashboard" });
}
export {
  AppIndex as component
};
