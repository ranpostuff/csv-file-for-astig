import type { Config } from "@react-router/dev/config";

// "/" normally. The GitHub Pages workflow sets VITE_BASE_PATH to "/<repo-name>/".
const basePath = process.env.VITE_BASE_PATH ?? "/";

export default {
  basename: basePath,
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
} satisfies Config;
