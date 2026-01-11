"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarView } from "./use-calendar";

interface CalendarHeaderProps {
  headerLabel: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
}

const viewOptions: { value: CalendarView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "3day", label: "3 Days" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function CalendarHeader({
  headerLabel,
  view,
  onViewChange,
  onNavigate,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => onNavigate("today")}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="ml-2 text-lg font-semibold">{headerLabel}</h2>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 rounded-lg border p-1">
        {viewOptions.map((option) => (
          <Button
            key={option.value}
            variant={view === option.value ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => onViewChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
