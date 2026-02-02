module.exports = function (eleventyConfig) {
  // Publish folder assets ke output
  eleventyConfig.addPassthroughCopy("assets");

  // Helper: normalisasi tags agar selalu array
  function normalizeTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") return [tags];
    return [];
  }

  // Posts collection (newest -> oldest)
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("posts/*.md").reverse();
  });

  // Tag list untuk halaman /tags
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getAll().forEach((item) => {
      normalizeTags(item.data.tags).forEach((t) => tags.add(t));
    });
    return [...tags].sort();
  });

  // Category list untuk halaman /categories
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const cats = new Set();
    collectionApi.getAll().forEach((item) => {
      const c = item.data.category;
      if (c) cats.add(c);
    });
    return [...cats].sort();
  });

  // Site global (dipakai untuk canonical + sitemap)
  eleventyConfig.addGlobalData("site", {
    url: "https://agenmicat.pages.dev",
    name: "AgenMicat"
  });

  // Filter untuk sitemap lastmod: YYYY-MM-DD
  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toISOString().slice(0, 10);
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
