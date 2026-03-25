export type PostCategory = "projects" | "skills" | "posts";
export type PostSort = "date" | "title";

export type PostFrontmatterLike = {
  title: string;
  date: string;
  description: string;
  isProject: boolean;
  isSkill: boolean;
};

export type PostSummaryLike = {
  slug: string;
  frontmatter: PostFrontmatterLike;
};

type CategoryFrontmatter = Pick<PostFrontmatterLike, "isProject" | "isSkill">;

export function getPostCategory(
  frontmatter: CategoryFrontmatter,
): PostCategory {
  if (frontmatter.isProject) {
    return "projects";
  }

  if (frontmatter.isSkill) {
    return "skills";
  }

  return "posts";
}

export function getPostCategoryLabel(category: PostCategory): string {
  if (category === "projects") {
    return "Project";
  }

  if (category === "skills") {
    return "Skill";
  }

  return "Post";
}

export function parsePostSort(value: string | null | undefined): PostSort {
  return value === "title" ? "title" : "date";
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function getDateTimestamp(dateValue: string): number | null {
  if (!dateValue) {
    return null;
  }

  const timestamp = Date.parse(dateValue);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function compareDateValuesDesc(dateA: string, dateB: string): number {
  const timestampA = getDateTimestamp(dateA);
  const timestampB = getDateTimestamp(dateB);

  if (timestampA !== null && timestampB !== null) {
    return timestampB - timestampA;
  }

  if (timestampA !== null) {
    return -1;
  }

  if (timestampB !== null) {
    return 1;
  }

  return 0;
}

export function comparePostsByDateDesc<T extends PostSummaryLike>(
  a: T,
  b: T,
): number {
  const dateCompare = compareDateValuesDesc(
    a.frontmatter.date,
    b.frontmatter.date,
  );

  if (dateCompare !== 0) {
    return dateCompare;
  }

  const titleCompare = compareText(a.frontmatter.title, b.frontmatter.title);

  if (titleCompare !== 0) {
    return titleCompare;
  }

  return a.slug.localeCompare(b.slug);
}

export function comparePostsByTitleAsc<T extends PostSummaryLike>(
  a: T,
  b: T,
): number {
  const titleCompare = compareText(a.frontmatter.title, b.frontmatter.title);

  if (titleCompare !== 0) {
    return titleCompare;
  }

  const dateCompare = compareDateValuesDesc(
    a.frontmatter.date,
    b.frontmatter.date,
  );

  if (dateCompare !== 0) {
    return dateCompare;
  }

  return a.slug.localeCompare(b.slug);
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

function isOrderedSubsequence(token: string, text: string): boolean {
  let tokenIndex = 0;

  for (const character of text) {
    if (character === token[tokenIndex]) {
      tokenIndex += 1;
    }

    if (tokenIndex === token.length) {
      return true;
    }
  }

  return tokenIndex === token.length;
}

function matchesToken(token: string, text: string): boolean {
  return text.includes(token) || isOrderedSubsequence(token, text);
}

export function matchesPostQuery<T extends PostSummaryLike>(
  post: T,
  query: string,
): boolean {
  const tokens = normalizeSearchText(query).split(/\s+/u).filter(Boolean);

  if (!tokens.length) {
    return true;
  }

  const searchableFields = [
    normalizeSearchText(post.frontmatter.title),
    normalizeSearchText(post.frontmatter.description),
  ];

  return tokens.every((token) =>
    searchableFields.some((field) => matchesToken(token, field)),
  );
}

export function filterPosts<T extends PostSummaryLike>(
  posts: T[],
  options: {
    query: string;
    includeProjects: boolean;
    includeSkills: boolean;
  },
): T[] {
  const { includeProjects, includeSkills, query } = options;

  return posts.filter((post) => {
    const category = getPostCategory(post.frontmatter);
    const matchesCategory =
      includeProjects || includeSkills
        ? (includeProjects && category === "projects") ||
          (includeSkills && category === "skills")
        : true;

    return matchesCategory && matchesPostQuery(post, query);
  });
}

export function sortPosts<T extends PostSummaryLike>(
  posts: T[],
  sort: PostSort,
): T[] {
  return [...posts].sort(
    sort === "title" ? comparePostsByTitleAsc : comparePostsByDateDesc,
  );
}
