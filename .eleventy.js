module.exports = function (eleventyConfig) {
  // supaya /assets/style.css ikut ter-publish
  eleventyConfig.addPassthroughCopy("assets");

  // collection dari folder posts
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("posts/*.md").reverse();
  });

  return {
    dir: {
      input: ".",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
