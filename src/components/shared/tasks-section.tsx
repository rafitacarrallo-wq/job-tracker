"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/types";

interface TasksSectionProps {
  tasks: Task[];
  entityType: "watchlist" | "contact" | "application";
  entityId: string;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskUpdate: (taskId: string, data: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  compact?: boolean;
}

export function TasksSection({
  tasks,
  entityType,
  entityId,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  compact = false,
}: TasksSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const taskData: Partial<Task> = {
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
    };

    if (entityType === "watchlist") {
      taskData.watchlistId = entityId;
    } else if (entityType === "contact") {
      taskData.contactId = entityId;
    } else if (entityType === "application") {
      taskData.applicationId = entityId;
    }

    onTaskCreate(taskData);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setIsAdding(false);
  };

  const handleToggleComplete = (task: Task) => {
    onTaskUpdate(task.id, { completed: !task.completed });
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${compact ? "text-sm" : ""}`}>
          Tasks {pendingTasks.length > 0 && `(${pendingTasks.length})`}
        </h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 px-2 text-xs"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        )}
      </div>

      {/* Add new task form */}
      {isAdding && (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
          <Input
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
              if (e.key === "Escape") setIsAdding(false);
            }}
          />
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="h-8 text-sm flex-1"
            />
            <Button size="sm" className="h-8" onClick={handleAddTask}>
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle("");
                setNewTaskDueDate("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Pending tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-1">
          {pendingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleComplete(task)}
              onDelete={() => onTaskDelete(task.id)}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No tasks yet
        </p>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-1 pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">
            Completed ({completedTasks.length})
          </p>
          {completedTasks.slice(0, 3).map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleComplete(task)}
              onDelete={() => onTaskDelete(task.id)}
              compact={compact}
            />
          ))}
          {completedTasks.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{completedTasks.length - 3} more completed
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  compact?: boolean;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`group flex items-start gap-2 rounded-md p-2 hover:bg-muted/50 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </p>
        {task.dueDate && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
            {isOverdue && " (overdue)"}
          </div>
        )}
        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Link
          </a>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
}
