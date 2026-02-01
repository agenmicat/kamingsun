module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("post/*.md")
	reverse();
  });

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
