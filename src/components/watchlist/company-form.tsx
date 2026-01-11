"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TasksSection } from "@/components/shared/tasks-section";
import type { WatchlistCompany, Task } from "@/types";

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: WatchlistCompany | null;
  onSubmit: (data: Partial<WatchlistCompany>) => void;
}

export function CompanyForm({
  open,
  onOpenChange,
  company,
  onSubmit,
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    notes: "",
    careersUrl: "",
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        notes: company.notes || "",
        careersUrl: company.careersUrl || "",
      });
      // Fetch tasks for this company
      fetchTasks(company.id);
    } else {
      setFormData({
        name: "",
        notes: "",
        careersUrl: "",
      });
      setTasks([]);
    }
  }, [company, open]);

  const fetchTasks = async (watchlistId: string) => {
    try {
      const response = await fetch(`/api/tasks?watchlistId=${watchlistId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskUpdate = async (taskId: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={company ? "max-w-lg" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            {company ? "Edit Company" : "Add Company to Watchlist"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Stripe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careersUrl">Careers Page URL</Label>
            <Input
              id="careersUrl"
              type="url"
              value={formData.careersUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, careersUrl: e.target.value }))
              }
              placeholder="https://stripe.com/careers"
            />
            <p className="text-xs text-muted-foreground">
              The company logo will be automatically detected from this URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Why I&apos;m interested</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Great engineering culture, interesting products..."
              rows={3}
            />
          </div>

          {/* Tasks section - only show when editing */}
          {company && (
            <>
              <Separator />
              <TasksSection
                tasks={tasks}
                entityType="watchlist"
                entityId={company.id}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                compact
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {company ? "Save Changes" : "Add to Watchlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
