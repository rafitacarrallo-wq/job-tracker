"use client";

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { KanbanColumn } from "./kanban-column";
import { ApplicationsMobileList } from "./applications-mobile-list";
import { ApplicationForm } from "./application-form";
import { Button } from "@/components/ui/button";
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/types";

export function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>("SAVED");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;

    // Optimistic update
    setApplications((prev) =>
      prev.map((app) =>
        app.id === draggableId ? { ...app, status: newStatus } : app
      )
    );

    // Update on server
    try {
      await fetch(`/api/applications/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      fetchApplications(); // Revert on error
    }
  };

  const handleCreate = async (data: Partial<Application>) => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newApplication = await response.json();
      setApplications((prev) => [newApplication, ...prev]);
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const handleEdit = async (data: Partial<Application>) => {
    if (!editingApplication) return;

    try {
      const response = await fetch(`/api/applications/${editingApplication.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedApplication = await response.json();
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingApplication.id ? updatedApplication : app
        )
      );
      setEditingApplication(null);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const openEditForm = (application: Application) => {
    setEditingApplication(application);
    setFormOpen(true);
  };

  const openNewForm = (status: ApplicationStatus = "SAVED") => {
    setEditingApplication(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  const getApplicationsByStatus = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status);

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
          <h1 className="text-xl font-bold md:text-2xl">Applications</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Track and manage your job applications
          </p>
        </div>
        <Button onClick={() => openNewForm()} size="sm" className="md:size-default">
          <Plus className="mr-1 h-4 w-4 md:mr-2" />
          <span className="hidden sm:inline">New Application</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden">
        <ApplicationsMobileList
          applications={applications}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>

      {/* Desktop Kanban View */}
      <div className="hidden md:block">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
            {APPLICATION_STATUSES.map((status) => (
              <KanbanColumn
                key={status.value}
                status={status.value}
                applications={getApplicationsByStatus(status.value)}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <ApplicationForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingApplication(null);
        }}
        application={editingApplication}
        onSubmit={editingApplication ? handleEdit : handleCreate}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
