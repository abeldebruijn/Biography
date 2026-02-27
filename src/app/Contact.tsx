import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { ContactContributionGraph } from "@/components/home/contact-contribution-graph";
import {
  ContributionGraphLegend,
  type Activity,
} from "@/components/kibo-ui/contribution-graph";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type Response = {
  contributions: Activity[];
  total: Record<string, number>;
};

const username = "abeldebruijn";

const getCachedContributions = cache(
  async () => {
    try {
      const url = new URL(
        `/v4/${username}`,
        "https://github-contributions-api.jogruber.de",
      );
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch contributions: ${response.status}`);
      }
      const data = (await response.json()) as Response;
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const contributions = data.contributions.filter((activity) => {
        const date = new Date(activity.date);
        return !Number.isNaN(date.getTime()) && date >= oneYearAgo;
      });
      const total = contributions.reduce(
        (sum, activity) => sum + activity.count,
        0,
      );
      return { contributions, total };
    } catch {
      return { contributions: [], total: 0 };
    }
  },
  ["github-contributions"],
  { revalidate: 60 * 60 * 24 },
);

export async function Contact() {
  const { contributions } = await getCachedContributions();
  const hasContributions = contributions.length > 0;

  return (
    <section className="relative z-20 mx-auto mt-2 w-full max-w-5xl px-4 pb-16 sm:px-8">
      <h2
        id="contact"
        className="font-(family-name:--font-cormorant) text-[clamp(1.7rem,3vw,2.35rem)] tracking-[0.01em] text-[#edf4ff]"
      >
        Contact
      </h2>
      <ul className="mt-4 grid gap-4">
        <li className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 transition-colors hover:border-[#9eceff]/32 max-w-full overflow-hidden">
          <Link className="p-5 block" href={`https://github.com/abeldebruijn`}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
              GitHub
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#d7e5f7]/92">
              github.com/abeldebruijn
            </p>

            {hasContributions && (
              <ContactContributionGraph data={contributions} />
            )}
          </Link>
        </li>

        <li className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 transition-colors hover:border-[#9eceff]/32 ">
          <Link
            className="p-5 flex justify-between w-full items-end"
            href={`https://linkedin.com/in/abeldebruijn`}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                LinkedIn
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#d7e5f7]/92">
                linkedin.com/in/abeldebruijn
              </p>
            </div>

            <Button variant="outline" size="sm">
              Visit <ExternalLink />{" "}
            </Button>
          </Link>
        </li>
      </ul>
    </section>
  );
}
