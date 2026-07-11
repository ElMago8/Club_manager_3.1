import { jsx, Fragment } from "react/jsx-runtime";
import { useContext } from "react";
import { e as RoleContext } from "./router-Rtc38bRC.js";
function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a <RoleProvider>.");
  }
  return ctx;
}
const ACTION_ROLES = {
  create_item: ["admin", "manager"],
  edit_item: ["admin", "manager"],
  delete_item: ["admin", "manager"],
  log_movement: ["admin", "manager"],
  create_po: ["admin", "manager"],
  approve_request: ["admin", "manager"],
  manage_users: ["admin"],
  view_analytics: ["admin", "manager"],
  export_data: ["admin", "manager"],
  create_request: ["admin", "manager", "requestor"],
  access_settings: ["admin"],
  manage_suppliers: ["admin", "manager"]
};
function usePermissions() {
  const { role } = useRole();
  const can = (action) => {
    return ACTION_ROLES[action]?.includes(role) ?? false;
  };
  return { can };
}
function PermissionGate({ permission, fallback = null, children }) {
  const { can } = usePermissions();
  return can(permission) ? /* @__PURE__ */ jsx(Fragment, { children }) : /* @__PURE__ */ jsx(Fragment, { children: fallback });
}
export {
  PermissionGate as P,
  useRole as a,
  usePermissions as u
};
