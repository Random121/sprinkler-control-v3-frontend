/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended",
        "@vue/eslint-config-prettier",
    ],
    rules: {
        semi: ["warn", "always"],
        "prettier/prettier": 0,
        "vue/script-indent": ["warn", 4, { baseIndent: 0 }],
        "vue/html-indent": ["warn", 4, { baseIndent: 1 }],
    },
};
