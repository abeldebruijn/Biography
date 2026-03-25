import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type EmbedPageProps = {
  title?: string;
  src: string;
  width?: string;
  height?: string;
  className?: string;
};

export const EmbedPage = ({
  title,
  src,
  width = "100%",
  height = "720px",
  className = "",
}: EmbedPageProps) => {
  return (
    <div
      className={cn(
        `rounded-3xl p-5 border border-[#9eceff]/16 bg-[#0c1d32]/66 transition-colors hover:border-[#9eceff]/32`,
        className,
      )}
    >
      <iframe
        title={title}
        className="rounded-lg overflow-hidden"
        src={src}
        width={width}
        height={height}
      />

      <div className="flex justify-between gap-2 mt-5 items-center">
        <span>{title}</span>
        <Link href={src}>
          <Button variant="outline" size="sm" className="w-64">
            Visit <ExternalLink />
          </Button>
        </Link>
      </div>
    </div>
  );
};
