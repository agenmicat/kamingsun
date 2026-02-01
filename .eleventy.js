module.exports = function (eleventyConfig) {
  // supaya /assets/style.css ikut ter-publish
  eleventyConfig.addPassthroughCopy("assets");

  // collection dari folder posts
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("posts/*.md").reverse();
  });
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
  collectionApi.getAll().forEach((item) => {
    (item.data.tags || []).forEach((t) => tags.add(t));
    });
    return [...tags].sort();
  });
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const cats = new Set();
  collectionApi.getAll().forEach((item) => {
    const c = item.data.category;
      if (c) cats.add(c);
    });
    return [...cats].sort();
  });
  eleventyConfig.addGlobalData("site", {
    url: "https://agenmicat.pages.dev"
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
