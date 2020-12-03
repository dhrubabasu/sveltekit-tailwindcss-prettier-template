module.exports = {
    adapter: "@sveltejs/adapter-static",
    preprocess: require("svelte-preprocess")({ postcss: true })
};
