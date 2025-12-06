/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 80,
  endOfLine: "auto",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
