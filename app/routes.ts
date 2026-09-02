/* This route manifest exposes the portfolio homepage, work narratives, and client-side 404 view. */
import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("work/:slug", "routes/work.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
