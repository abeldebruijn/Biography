import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/posts";
import { PostsExplorer } from "./posts-explorer";

export default async function PostsIndexPage() {
  const allPosts = await getAllPosts();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8 lg:py-20">
      <div className="space-y-5">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[#9eceff]/26 bg-[#0c1d32]/66 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#dff0ff] transition-colors hover:border-[#9eceff]/55 hover:text-[#ffffff]"
          href="/"
        >
          <span aria-hidden="true">←</span>
          Back home
        </Link>

        <section className="rounded-[2rem] border border-[#9eceff]/18 bg-[#091426]/72 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.22)] backdrop-blur-lg sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#b7cbe6]/80">
            Archive
          </p>
          <h1 className="mt-3 font-(family-name:--font-cormorant) text-[clamp(2.5rem,7vw,4.4rem)] leading-[0.92] text-[#edf4ff]">
            Posts
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#d8e7fb]/92 sm:text-base">
            Browse all writing, projects, and skills in one place. Search by
            title or description, filter by category, and sort by date or title.
          </p>
          <div className="mt-6">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#9eceff]/38 bg-[#0c1d32]/66 text-[#dff0ff] hover:bg-[#132845] hover:text-white"
            >
              <Link href="/#posts">Jump to homepage teaser</Link>
            </Button>
          </div>
        </section>
      </div>

      <Suspense
        fallback={
          <div className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-8 text-center text-sm text-[#d7e5f7]/88">
            Loading posts…
          </div>
        }
      >
        <PostsExplorer posts={allPosts} />
      </Suspense>
    </main>
  );
}
