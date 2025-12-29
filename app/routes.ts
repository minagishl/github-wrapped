import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("wrapped/:username", "routes/wrapped.$username.tsx"),
  route("api/github/:username", "routes/api.github.$username.ts"),
] satisfies RouteConfig;
