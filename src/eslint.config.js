import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node, // Node.js runs on server
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-irregular-whitespace": "warn",
    },
  },
];
