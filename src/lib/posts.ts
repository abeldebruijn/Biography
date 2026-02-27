import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

type RawPostFrontmatter = Partial<PostFrontmatter> &
  Record<string, unknown> & { isProject?: boolean };

type ImportedPostModule = {
  default: ComponentType;
  frontmatter?: RawPostFrontmatter;
};

export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  isProject: boolean;
};

export type PostSummary = {
  slug: string;
  frontmatter: PostFrontmatter;
};

function normalizeFrontmatter(
  slug: string,
  frontmatter?: RawPostFrontmatter,
): PostFrontmatter {
  return {
    title: frontmatter?.title ?? slug,
    date: frontmatter?.date ?? "",
    description: frontmatter?.description ?? "",
    isProject: frontmatter?.isProject ?? false,
  };
}

function isValidDateString(dateValue: string): boolean {
  if (!dateValue) {
    return false;
  }

  return !Number.isNaN(Date.parse(dateValue));
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await readdir(CONTENT_DIR);

  return files
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/u, ""))
    .sort((a, b) => a.localeCompare(b));
}

export async function getPostModule(
  slug: string,
): Promise<{ default: ComponentType; frontmatter: PostFrontmatter }> {
  const postModule = (await import(
    `@/content/${slug}.mdx`
  )) as unknown as ImportedPostModule;

  return {
    default: postModule.default,
    frontmatter: normalizeFrontmatter(slug, postModule.frontmatter),
  };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getPostModule(slug);
      return {
        slug,
        frontmatter,
      };
    }),
  );

  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date;
    const dateB = b.frontmatter.date;

    if (isValidDateString(dateA) && isValidDateString(dateB)) {
      const timestampA = Date.parse(dateA);
      const timestampB = Date.parse(dateB);

      if (timestampA !== timestampB) {
        return timestampB - timestampA;
      }
    }

    return a.slug.localeCompare(b.slug);
  });
}
