import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/guest.tsx", [route("login", "routes/login.tsx")]),

  layout("routes/protected.tsx", [
    layout("routes/dashboard.tsx", [
      index("routes/dashboard-home.tsx"),

      route("teachers", "routes/teachers.tsx"),
      route("teachers/create", "routes/teachers-create.tsx"),
      route("teachers/:id/edit", "routes/teachers-edit.tsx"),
      route("teachers/:id", "routes/teachers-details.tsx"),

      route("grades", "routes/grades.tsx"),
      route("sections", "routes/sections.tsx"),
      route("students", "routes/students.tsx"),
      route("admin/syconfigs", "routes/admin-syconfigs.tsx"),
    ]),

    route("verification", "routes/verification.tsx"),
  ]),
] satisfies RouteConfig;
