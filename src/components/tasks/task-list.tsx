"use client";

import { useState, useEffect } from "react";
import { Plus, List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import { TaskCalendar } from "./task-calendar";
import type { Task, Application, WatchlistCompany, Contact } from "@/types";

type FilterType = "all" | "pending" | "completed" | "overdue";
type ViewMode = "list" | "calendar";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [watchlistCompanies, setWatchlistCompanies] = useState<WatchlistCompany[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, appsRes, watchlistRes, contactsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/applications"),
        fetch("/api/watchlist"),
        fetch("/api/contacts"),
      ]);

      const [tasksData, appsData, watchlistData, contactsData] = await Promise.all([
        tasksRes.json(),
        appsRes.json(),
        watchlistRes.json(),
        contactsRes.json(),
      ]);

      setTasks(tasksData);
      setApplications(appsData);
      setWatchlistCompanies(watchlistData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newTask = await response.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEdit = async (data: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updatedTask : t))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      // Handle nextStep items differently - clear the nextStep fields on the application
      if (task.type === "nextStep" && completed) {
        const applicationId = id.replace("nextstep-", "");
        const response = await fetch(`/api/applications/${applicationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nextStep: null, nextStepDate: null }),
        });
        if (response.ok) {
          // Remove the nextStep item from the list
          setTasks((prev) => prev.filter((t) => t.id !== id));
        }
        return;
      }

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed }),
      });
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...updatedTask, type: "task" } : t)));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);

    // Don't allow deleting nextStep items - they should be completed instead
    if (task?.type === "nextStep") {
      if (confirm("This is an application next step. Would you like to mark it as completed?")) {
        handleToggleComplete(id, true);
      }
      return;
    }

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const openNewForm = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const now = new Date();
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "overdue":
        return (
          !task.completed &&
          task.dueDate &&
          new Date(task.dueDate) < now
        );
      default:
        return true;
    }
  });

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Tasks</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage your job search tasks and reminders
          </p>
        </div>
        <Button onClick={openNewForm} size="sm">
          <Plus className="mr-1 h-4 w-4 md:mr-2" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="shrink-0"
            >
              {f.label}
              {f.value === "pending" && (
                <span className="ml-1.5 text-xs">
                  ({tasks.filter((t) => !t.completed).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg border p-1 self-start sm:self-auto">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-1 h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="mr-1 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Task List or Calendar */}
      {viewMode === "list" ? (
        <div className="flex-1 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No tasks found</p>
              <Button variant="link" onClick={openNewForm} className="mt-2">
                Create your first task
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div className="flex-1">
          <TaskCalendar
            tasks={filteredTasks}
            onTaskClick={openEditForm}
          />
        </div>
      )}

      <TaskForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={editingTask ? handleEdit : handleCreate}
        applications={applications}
        watchlistCompanies={watchlistCompanies}
        contacts={contacts}
      />
    </div>
  );
}
