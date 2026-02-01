module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md")
	reverse();
  });
	eleventyConfig.addPassthroughCopy("assets");
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
