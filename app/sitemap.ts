import type { MetadataRoute } from "next";
import { person } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: person.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
