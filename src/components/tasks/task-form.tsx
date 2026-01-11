"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Task, Application, WatchlistCompany, Contact } from "@/types";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (data: Partial<Task>) => void;
  applications?: Application[];
  watchlistCompanies?: WatchlistCompany[];
  contacts?: Contact[];
  defaultApplicationId?: string | null;
  defaultWatchlistId?: string | null;
  defaultContactId?: string | null;
}

export function TaskForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  applications = [],
  watchlistCompanies = [],
  contacts = [],
  defaultApplicationId,
  defaultWatchlistId,
  defaultContactId,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null as Date | null,
    link: "",
    applicationId: "",
    watchlistId: "",
    contactId: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        link: task.link || "",
        applicationId: task.applicationId || "",
        watchlistId: task.watchlistId || "",
        contactId: task.contactId || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: null,
        link: "",
        applicationId: defaultApplicationId || "",
        watchlistId: defaultWatchlistId || "",
        contactId: defaultContactId || "",
      });
    }
  }, [task, open, defaultApplicationId, defaultWatchlistId, defaultContactId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || null,
      dueDate: formData.dueDate,
      link: formData.link || null,
      applicationId: formData.applicationId || null,
      watchlistId: formData.watchlistId || null,
      contactId: formData.contactId || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Follow up on application"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Additional details..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(formData.dueDate, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate || undefined}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, dueDate: date || null }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link/URL</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label>Link to Application</Label>
            <Select
              value={formData.applicationId}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  applicationId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Watchlist Company</Label>
            <Select
              value={formData.watchlistId}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  watchlistId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {watchlistCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Contact</Label>
            <Select
              value={formData.contactId}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  contactId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name}
                    {contact.company && ` (${contact.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{task ? "Save Changes" : "Create Task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
