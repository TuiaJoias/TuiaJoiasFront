import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Protótipo de design (referência visual, não faz parte do app).
    // O "#" precisa de escape: no início de um glob ele vira comentário.
    "\\# Redesign Joalheria Premium/**",
  ]),
]);

export default eslintConfig;
