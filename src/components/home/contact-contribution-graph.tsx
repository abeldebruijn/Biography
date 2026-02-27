"use client";

import { ExternalLink } from "lucide-react";
import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphLegend,
} from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function ContactContributionGraph({ data }: { data: Activity[] }) {
  return (
    <ContributionGraph data={data} className="my-4">
      <ContributionGraphCalendar className="overflow-hidden">
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
            className={cn(
              'data-[level="0"]:fill-[#161b22]',
              'data-[level="1"]:fill-[#0e4429]',
              'data-[level="2"]:fill-[#006d32]',
              'data-[level="3"]:fill-[#26a641]',
              'data-[level="4"]:fill-[#39d353]',
            )}
          />
        )}
      </ContributionGraphCalendar>
      <div className="flex justify-between w-full gap-4">
        <ContributionGraphLegend />
        <Button variant="outline" size="sm">
          Visit <ExternalLink />{" "}
        </Button>
      </div>
    </ContributionGraph>
  );
}
