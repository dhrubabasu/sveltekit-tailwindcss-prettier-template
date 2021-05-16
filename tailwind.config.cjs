const {tailwindExtractor} = require("tailwindcss/lib/lib/purgeUnusedStyles");

module.exports = {
  mode: "aot",
  purge: {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    options: {
      defaultExtractor: (content) => [
        ...tailwindExtractor(content),
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
      ],
    },
    safelist: [/^svelte-[\d\w]+$/],
  },
};
