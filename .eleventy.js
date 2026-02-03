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
  // ISO datetime: 2026-02-03T10:20:30.000Z
  eleventyConfig.addFilter("isoDateTime", (value) => {
    if (!value) return "";
    const d = new Date(value);
      return d.toISOString();
  });

  // seconds -> ISO 8601 duration: PT1H2M3S
  eleventyConfig.addFilter("isoDuration", (seconds) => {
    const s = Number(seconds);
    if (!Number.isFinite(s) || s <= 0) return "";
    let rem = Math.floor(s);
    const h = Math.floor(rem / 3600); rem -= h * 3600;
    const m = Math.floor(rem / 60);   rem -= m * 60;
    const sec = rem;

    let out = "PT";
    if (h) out += `${h}H`;
    if (m) out += `${m}M`;
    if (sec || (!h && !m)) out += `${sec}S`;
    return out;
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
  eleventyConfig.addGlobalData("site", {
    url: "https://agenmicat.pages.dev",
    name: "AgenMicat"
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
