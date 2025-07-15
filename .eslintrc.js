module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:tailwindcss/recommended",
        "plugin:@reduxjs/toolkit/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "jsx-a11y",
        "tailwindcss",
        "@reduxjs/toolkit",
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        // React specific rules
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/self-closing-comp": "warn",
        "react/jsx-sort-props": [
            "warn",
            {
                callbacksLast: true,
                shorthandFirst: true,
                ignoreCase: true,
                reservedFirst: true,
            },
        ],

        // TypeScript specific rules
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            { prefer: "type-imports" },
        ],

        // Tailwind specific rules
        "tailwindcss/classnames-order": "warn",
        "tailwindcss/enforces-negative-arbitrary-values": "warn",
        "tailwindcss/enforces-shorthand": "warn",
        "tailwindcss/migration-from-tailwind-2": "warn",

        // Redux Toolkit specific rules
        "@reduxjs/toolkit/immer-patches": "warn",
        "@reduxjs/toolkit/no-unsafe-argument": "warn",
        "@reduxjs/toolkit/no-unsafe-assignment": "warn",
        "@reduxjs/toolkit/no-unsafe-call": "warn",
        "@reduxjs/toolkit/no-unsafe-member-access": "warn",
        "@reduxjs/toolkit/no-unsafe-return": "warn",

        // General rules
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "warn",
        "no-duplicate-imports": "error",
        "no-unused-expressions": "error",
        "prefer-const": "warn",
        "sort-imports": [
            "warn",
            {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
                allowSeparatedGroups: true,
            },
        ],
    },
};
