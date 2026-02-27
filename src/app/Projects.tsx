import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function Projects() {
  const allPosts = await getAllPosts();
  const projectPosts = allPosts.filter((post) => post.frontmatter.isProject);

  return (
    <section className="relative z-20 mx-auto mt-2 w-full max-w-5xl px-4 pb-16 sm:px-8">
      <h2
        id="projects"
        className="font-(family-name:--font-cormorant) text-[clamp(1.7rem,3vw,2.35rem)] tracking-[0.01em] text-[#edf4ff]"
      >
        Projects
      </h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {projectPosts.map((post) => (
          <li
            className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 transition-colors hover:border-[#9eceff]/32"
            key={post.slug}
          >
            <Link className="p-5 block" href={`/posts/${post.slug}`}>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                {post.frontmatter.date}
              </p>

              {post.frontmatter.title}
              <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92">
                {post.frontmatter.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
