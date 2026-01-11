"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import { useCalendar } from "./use-calendar";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid } from "./calendar-grid";
import type { Task } from "@/types";

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

export function TaskCalendar({ tasks, onTaskClick, onDateClick }: TaskCalendarProps) {
  const calendar = useCalendar();

  // Filter tasks that have due dates
  const tasksWithDueDate = useMemo(
    () => tasks.filter((task) => task.dueDate !== null),
    [tasks]
  );

  const tasksWithoutDueDate = tasks.length - tasksWithDueDate.length;

  return (
    <div className="space-y-4">
      <CalendarHeader
        headerLabel={calendar.headerLabel}
        view={calendar.view}
        onViewChange={calendar.setView}
        onNavigate={calendar.navigate}
      />

      {tasksWithoutDueDate > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Info className="h-4 w-4" />
          <span>
            {tasksWithoutDueDate} task{tasksWithoutDueDate !== 1 ? "s" : ""} without due date
            {tasksWithoutDueDate !== 1 ? " are" : " is"} hidden. Switch to list view to see all tasks.
          </span>
        </div>
      )}

      <CalendarGrid
        visibleDates={calendar.visibleDates}
        currentDate={calendar.currentDate}
        tasks={tasksWithDueDate}
        view={calendar.view}
        onTaskClick={onTaskClick}
        onDateClick={onDateClick}
      />
    </div>
  );
}

export { useCalendar } from "./use-calendar";
export type { CalendarView } from "./use-calendar";
