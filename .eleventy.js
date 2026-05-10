export default function (eleventyConfig) {
  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });

  // Watch CSS/JS for live reload
  eleventyConfig.addWatchTarget("./src/assets/css/");
  eleventyConfig.addWatchTarget("./src/assets/js/");

  // Filter: format current year for footer
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Filter: ISO timestamp for sitemap
  eleventyConfig.addFilter("toISOString", (d) => {
    const date = d instanceof Date ? d : new Date(d || Date.now());
    return date.toISOString();
  });

  // Build alternate-language URL for hreflang tags
  eleventyConfig.addFilter("altLangUrl", function (url, targetLang) {
    if (targetLang === "he") {
      return url === "/" ? "/he/" : `/he${url}`;
    }
    // EN: strip /he prefix
    return url.replace(/^\/he/, "") || "/";
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
