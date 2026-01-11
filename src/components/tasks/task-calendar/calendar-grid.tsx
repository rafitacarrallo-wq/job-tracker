"use client";

import { isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDayCell } from "./calendar-day-cell";
import type { Task } from "@/types";
import type { CalendarView } from "./use-calendar";

interface CalendarGridProps {
  visibleDates: Date[];
  currentDate: Date;
  tasks: Task[];
  view: CalendarView;
  onTaskClick: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarGrid({
  visibleDates,
  currentDate,
  tasks,
  view,
  onTaskClick,
  onDateClick,
}: CalendarGridProps) {
  // Grid columns based on view
  const gridColsClass = {
    month: "grid-cols-7",
    week: "grid-cols-7",
    "3day": "grid-cols-3",
    day: "grid-cols-1",
  }[view];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Weekday Headers - Only for month and week views */}
      {(view === "month" || view === "week") && (
        <div className={cn("grid border-b bg-muted/50", gridColsClass)}>
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Calendar Grid */}
      <div className={cn("grid", gridColsClass)}>
        {visibleDates.map((date) => (
          <CalendarDayCell
            key={date.toISOString()}
            date={date}
            tasks={tasks}
            isCurrentMonth={isSameMonth(date, currentDate)}
            view={view}
            onTaskClick={onTaskClick}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}
