module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
  },
  extends: [
    "@react-native-community",
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier", "import"],
  rules: {
    complexity: ["error", 8],
    "import/order": "off",
    "import/extensions": 0,
    "react/jsx-filename-extension": [
      2,
      {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      },
    ],
    "import/no-unresolved": [
      2,
      {
        "ignore": ["@env"]
      }
    ],
    "arrow-body-style": 0,
    "import/prefer-default-export": 0,
    "eslint-comments/no-unlimited-disable": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "_",
        varsIgnorePattern: "_",
      },
    ],
    "react/jsx-key": [
      "error",
      {
        checkFragmentShorthand: true,
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          object: false,
          Function: false,
          "{}": false,
        },
        extendDefaults: true,
      },
    ],
    "jsx-a11y/anchor-is-valid": 0,
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-ignore": "allow-with-description" },
    ],
    "class-methods-use-this": 0,
    "import/no-cycle": 0,
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-param-reassign": [2, { props: false }],
    "react/require-default-props": "off",
    "react/no-unused-prop-types": 0,
    "import/no-extraneous-dependencies": 0
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        "project": "./",
      }
    }
  }
};
