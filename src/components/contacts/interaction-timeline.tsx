"use client";

import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import type { Interaction } from "@/types";

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export function InteractionTimeline({
  interactions,
}: InteractionTimelineProps) {
  if (interactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No interactions yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">{interaction.content}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {format(new Date(interaction.date), "PPP")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
