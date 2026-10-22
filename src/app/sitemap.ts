import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  // Hash-based case studies belong to this document, not separate crawlable URLs.
  return [{ url: "https://www.lauraharrispm.com/" }];
}
