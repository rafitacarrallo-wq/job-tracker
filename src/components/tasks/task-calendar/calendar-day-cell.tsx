"use client";

import { format, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "./calendar-event";
import type { Task } from "@/types";
import type { CalendarView } from "./use-calendar";

interface CalendarDayCellProps {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  view: CalendarView;
  onTaskClick: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

export function CalendarDayCell({
  date,
  tasks,
  isCurrentMonth,
  view,
  onTaskClick,
  onDateClick,
}: CalendarDayCellProps) {
  const dayTasks = tasks.filter(
    (task) => task.dueDate && isSameDay(new Date(task.dueDate), date)
  );
  const today = isToday(date);

  // Determine how many tasks to show based on view
  const maxVisibleTasks = view === "month" ? 3 : view === "week" ? 4 : 10;
  const visibleTasks = dayTasks.slice(0, maxVisibleTasks);
  const hiddenCount = dayTasks.length - visibleTasks.length;

  const isCompact = view === "month" || view === "week";

  // Cell height based on view
  const cellHeightClass = {
    month: "min-h-[100px]",
    week: "min-h-[120px]",
    "3day": "min-h-[200px]",
    day: "min-h-[300px]",
  }[view];

  return (
    <div
      className={cn(
        "border-r border-b p-1 transition-colors",
        cellHeightClass,
        !isCurrentMonth && "bg-muted/30",
        today && "bg-primary/5",
        onDateClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={() => onDateClick?.(date)}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            "inline-flex items-center justify-center text-sm",
            today && "h-6 w-6 rounded-full bg-primary text-primary-foreground font-semibold",
            !today && !isCurrentMonth && "text-muted-foreground",
            !today && isCurrentMonth && "font-medium"
          )}
        >
          {format(date, "d")}
        </span>
        {view !== "month" && (
          <span className="text-xs text-muted-foreground">
            {format(date, "EEE")}
          </span>
        )}
      </div>

      {/* Tasks */}
      <div className={cn("space-y-1", isCompact ? "space-y-0.5" : "space-y-1")}>
        {visibleTasks.map((task) => (
          <CalendarEvent
            key={task.id}
            task={task}
            compact={isCompact}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {hiddenCount > 0 && (
          <button
            className="w-full text-xs text-muted-foreground hover:text-foreground text-left px-1"
            onClick={(e) => {
              e.stopPropagation();
              // Could expand to show all or navigate to day view
            }}
          >
            +{hiddenCount} more
          </button>
        )}
      </div>
    </div>
  );
}
