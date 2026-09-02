/* This configuration gives React Router the Vite build pipeline used locally and on Vercel. */
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
});
