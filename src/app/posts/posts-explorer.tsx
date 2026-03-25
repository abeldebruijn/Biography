"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  filterPosts,
  getPostCategory,
  getPostCategoryLabel,
  type PostSort,
  type PostSummaryLike,
  parsePostSort,
  sortPosts,
} from "@/lib/post-utils";
import { cn } from "@/lib/utils";

type PostsExplorerProps = {
  posts: PostSummaryLike[];
};

function getCategoryBadgeClassName(
  category: ReturnType<typeof getPostCategory>,
) {
  if (category === "projects") {
    return "border-[#9eceff]/35 bg-[#9eceff]/10 text-[#dff0ff]";
  }

  if (category === "skills") {
    return "border-[#7ee7c6]/35 bg-[#7ee7c6]/10 text-[#dff7f0]";
  }

  return "border-[#e7c77f]/35 bg-[#e7c77f]/10 text-[#fff2d1]";
}

export function PostsExplorer({ posts }: PostsExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const sort = parsePostSort(searchParams.get("sort"));
  const includeProjects = searchParams.get("project") === "1";
  const includeSkills = searchParams.get("skill") === "1";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const deferredSearchInput = useDeferredValue(searchInput);

  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  function replaceUrl(nextState: {
    query: string;
    sort: PostSort;
    includeProjects: boolean;
    includeSkills: boolean;
  }) {
    const nextParams = new URLSearchParams();
    const trimmedQuery = nextState.query.trim();

    if (trimmedQuery) {
      nextParams.set("q", trimmedQuery);
    }

    if (nextState.sort !== "date") {
      nextParams.set("sort", nextState.sort);
    }

    if (nextState.includeProjects) {
      nextParams.set("project", "1");
    }

    if (nextState.includeSkills) {
      nextParams.set("skill", "1");
    }

    const nextUrl = nextParams.size
      ? `${pathname}?${nextParams.toString()}`
      : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  const visiblePosts = sortPosts(
    filterPosts(posts, {
      query: deferredSearchInput,
      includeProjects,
      includeSkills,
    }),
    sort,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#9eceff]/18 bg-[#091426]/72 p-5 shadow-[0_18px_80px_rgba(0,0,0,0.22)] backdrop-blur-lg sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80"
              htmlFor="posts-search"
            >
              Search
            </label>
            <input
              id="posts-search"
              type="search"
              value={searchInput}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setSearchInput(nextQuery);
                replaceUrl({
                  query: nextQuery,
                  sort,
                  includeProjects,
                  includeSkills,
                });
              }}
              placeholder="Search title or description"
              className="w-full rounded-2xl border border-[#9eceff]/24 bg-[#0c1d32]/78 px-4 py-3 text-sm text-[#edf4ff] outline-none placeholder:text-[#b7cbe6]/55 focus:border-[#9eceff]/55"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
              Filters
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={includeProjects}
                className={cn(
                  "rounded-full border-[#9eceff]/24 bg-[#0c1d32]/66 text-[#d7e5f7] hover:bg-[#132845] hover:text-white",
                  includeProjects &&
                    "border-[#9eceff]/60 bg-[#163254] text-white",
                )}
                onClick={() => {
                  replaceUrl({
                    query: searchInput,
                    sort,
                    includeProjects: !includeProjects,
                    includeSkills,
                  });
                }}
              >
                Projects
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={includeSkills}
                className={cn(
                  "rounded-full border-[#9eceff]/24 bg-[#0c1d32]/66 text-[#d7e5f7] hover:bg-[#132845] hover:text-white",
                  includeSkills &&
                    "border-[#9eceff]/60 bg-[#163254] text-white",
                )}
                onClick={() => {
                  replaceUrl({
                    query: searchInput,
                    sort,
                    includeProjects,
                    includeSkills: !includeSkills,
                  });
                }}
              >
                Skills
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80"
              htmlFor="posts-sort"
            >
              Sort
            </label>
            <select
              id="posts-sort"
              value={sort}
              onChange={(event) => {
                replaceUrl({
                  query: searchInput,
                  sort: parsePostSort(event.target.value),
                  includeProjects,
                  includeSkills,
                });
              }}
              className="min-w-36 rounded-2xl border border-[#9eceff]/24 bg-[#0c1d32]/78 px-4 py-3 text-sm text-[#edf4ff] outline-none focus:border-[#9eceff]/55"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#9eceff]/14 pt-4 text-sm text-[#d7e5f7]/88">
          <p>
            {`${visiblePosts.length} result${visiblePosts.length === 1 ? "" : "s"} of ${posts.length}`}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full px-0 text-[#9eceff] hover:bg-transparent hover:text-white"
            onClick={() => {
              setSearchInput("");
              replaceUrl({
                query: "",
                sort: "date",
                includeProjects: false,
                includeSkills: false,
              });
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {visiblePosts.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {visiblePosts.map((post) => {
            const category = getPostCategory(post.frontmatter);

            return (
              <li
                className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 transition-colors hover:border-[#9eceff]/32"
                key={post.slug}
              >
                <Link className="block p-5" href={`/posts/${post.slug}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                      {post.frontmatter.date || "Undated"}
                    </p>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
                        getCategoryBadgeClassName(category),
                      )}
                    >
                      {getPostCategoryLabel(category)}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[#eef4ff]">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92">
                    {post.frontmatter.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-8 text-center text-sm text-[#d7e5f7]/88">
          No posts match the current search and filters.
        </div>
      )}
    </div>
  );
}
