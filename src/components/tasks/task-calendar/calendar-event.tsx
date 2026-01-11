"use client";

import { isToday, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface CalendarEventProps {
  task: Task;
  compact?: boolean;
  onClick: () => void;
}

export function CalendarEvent({ task, compact = false, onClick }: CalendarEventProps) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const getStatusColor = () => {
    if (task.completed) return "bg-muted text-muted-foreground";
    if (isOverdue) return "bg-destructive/10 text-destructive border-destructive/20";
    if (isDueToday) return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary/50 text-secondary-foreground border-secondary";
  };

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "w-full text-left px-1.5 py-0.5 text-xs rounded border truncate transition-colors hover:opacity-80",
          getStatusColor(),
          task.completed && "line-through opacity-60"
        )}
      >
        {task.title}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "w-full text-left p-2 rounded-md border transition-colors hover:opacity-80",
        getStatusColor(),
        task.completed && "line-through opacity-60"
      )}
    >
      <p className="text-sm font-medium truncate">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {task.description}
        </p>
      )}
    </button>
  );
}
