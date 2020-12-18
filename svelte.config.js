module.exports = {
  preprocess: require('svelte-preprocess')({
    postcss: true
  }),
  kit: {
    adapter: "@sveltejs/adapter-static",
  },
};
