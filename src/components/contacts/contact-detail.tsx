"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Linkedin,
  Mail,
  Phone,
  Building2,
  Edit,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InteractionTimeline } from "./interaction-timeline";
import { InteractionForm } from "./interaction-form";
import { TasksSection } from "@/components/shared/tasks-section";
import type { Contact, Interaction, Reminder, Task } from "@/types";

interface ContactDetailProps {
  contact: Contact & { interactions: Interaction[]; reminders: Reminder[] };
  onAddInteraction: (content: string, date: Date) => void;
  onEdit: () => void;
}

export function ContactDetail({
  contact,
  onAddInteraction,
  onEdit,
}: ContactDetailProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [contact.id]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?contactId=${contact.id}`);
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarFallback className="text-lg md:text-xl">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-xl font-bold md:text-2xl truncate">{contact.name}</h2>
              {(contact.position || contact.company) && (
                <p className="text-sm text-muted-foreground md:text-base truncate">
                  {contact.position}
                  {contact.position && contact.company && " at "}
                  {contact.company}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0">
            <Edit className="mr-1 h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn Profile
            </a>
          )}
          {contact.company && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {contact.company}
            </div>
          )}
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contact.notes}
            </p>
          </div>
        )}

        <Separator className="my-6" />

        {/* Tasks */}
        <div className="mb-6">
          <TasksSection
            tasks={tasks}
            entityType="contact"
            entityId={contact.id}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>

        <Separator className="my-6" />

        {/* Reminders */}
        {contact.reminders.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Upcoming Reminders</h3>
              <div className="space-y-2">
                {contact.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 rounded-lg bg-muted p-3"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(reminder.dueDate), "PPP")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-6" />
          </>
        )}

        {/* Interactions */}
        <div>
          <h3 className="text-sm font-medium mb-4">Interaction History</h3>
          <InteractionForm onSubmit={onAddInteraction} />
          <div className="mt-6">
            <InteractionTimeline interactions={contact.interactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
