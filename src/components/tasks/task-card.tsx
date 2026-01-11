"use client";

import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
  ExternalLink,
  MoreHorizontal,
  Briefcase,
  Building2,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function getDateLabel(date: Date): { label: string; variant: "destructive" | "secondary" | "outline" } {
  if (isPast(date) && !isToday(date)) {
    return { label: "Overdue", variant: "destructive" };
  }
  if (isToday(date)) {
    return { label: "Today", variant: "destructive" };
  }
  if (isTomorrow(date)) {
    return { label: "Tomorrow", variant: "secondary" };
  }
  return { label: format(date, "MMM d"), variant: "outline" };
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isNextStep = task.type === "nextStep";
  const linkedType = task.application
    ? "application"
    : task.watchlist
    ? "watchlist"
    : task.contact
    ? "contact"
    : null;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
        task.completed && "opacity-60",
        isNextStep && "border-primary/30 bg-primary/5"
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          onToggleComplete(task.id, checked as boolean)
        }
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isNextStep && (
                <Badge variant="default" className="text-xs shrink-0">
                  <ArrowRight className="mr-1 h-3 w-3" />
                  Next Step
                </Badge>
              )}
              <p
                className={cn(
                  "font-medium truncate",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </p>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {task.dueDate && (
              <Badge variant={getDateLabel(new Date(task.dueDate)).variant}>
                <Calendar className="mr-1 h-3 w-3" />
                {getDateLabel(new Date(task.dueDate)).label}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isNextStep && (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {task.link && (
                  <DropdownMenuItem asChild>
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Link
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className={isNextStep ? "" : "text-destructive"}
                >
                  {isNextStep ? "Mark as Done" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {linkedType === "application" && task.application && (
            <Badge variant="outline" className="text-xs">
              <Briefcase className="mr-1 h-3 w-3" />
              {task.application.company} - {task.application.position}
            </Badge>
          )}
          {linkedType === "watchlist" && task.watchlist && (
            <Badge variant="outline" className="text-xs">
              <Building2 className="mr-1 h-3 w-3" />
              {task.watchlist.name}
            </Badge>
          )}
          {linkedType === "contact" && task.contact && (
            <Badge variant="outline" className="text-xs">
              <User className="mr-1 h-3 w-3" />
              {task.contact.name}
            </Badge>
          )}
          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
