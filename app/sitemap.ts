import type { MetadataRoute } from "next";
import { person, writing } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: person.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...writing.map((post) => ({
      url: `${person.siteUrl}/writing/${post.slug}/`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
