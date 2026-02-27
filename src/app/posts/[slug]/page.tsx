import { notFound } from "next/navigation";
import { getPostModule, getPostSlugs } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let postModule: Awaited<ReturnType<typeof getPostModule>>;
  try {
    postModule = await getPostModule(slug);
  } catch {
    notFound();
  }

  const { default: Content, frontmatter } = postModule;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16 sm:px-10">
      <header className="space-y-2 border-b border-foreground/10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {frontmatter.title}
        </h1>
        <p className="text-sm text-foreground/70">{frontmatter.description}</p>
        <p className="text-xs text-foreground/60">{frontmatter.date}</p>
      </header>

      <article className="prose prose-invert max-w-none">
        <Content />
      </article>
    </main>
  );
}
