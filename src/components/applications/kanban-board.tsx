"use client";

import { useState, useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { KanbanColumn } from "./kanban-column";
import { ApplicationsMobileList } from "./applications-mobile-list";
import { ApplicationForm } from "./application-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Filter states
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  // Sort states
  type SortField = "date" | "company" | "interest";
  type SortOrder = "asc" | "desc";
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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

  // Extract unique companies and positions for filters
  const uniqueCompanies = useMemo(() => {
    const companies = Array.from(new Set(applications.map((app) => app.company)));
    return companies.sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const uniquePositions = useMemo(() => {
    const positions = Array.from(new Set(applications.map((app) => app.position)));
    return positions.sort((a, b) => a.localeCompare(b));
  }, [applications]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let result = applications.filter((app) => {
      if (companyFilter !== "all" && app.company !== companyFilter) {
        return false;
      }
      if (positionFilter !== "all" && app.position !== positionFilter) {
        return false;
      }
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
          break;
        case "company":
          comparison = a.company.localeCompare(b.company);
          break;
        case "interest":
          comparison = a.interestLevel - b.interestLevel;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [applications, companyFilter, positionFilter, sortBy, sortOrder]);

  const hasActiveFilters = companyFilter !== "all" || positionFilter !== "all";

  const clearFilters = () => {
    setCompanyFilter("all");
    setPositionFilter("all");
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
    filteredApplications.filter((app) => app.status === status);

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

      {/* Filters & Sort Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        </div>

        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {uniqueCompanies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {uniquePositions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort:</span>
        </div>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "company" | "interest")}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="interest">Interest</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>

        {hasActiveFilters && (
          <span className="text-sm text-muted-foreground ml-auto">
            {filteredApplications.length} of {applications.length}
          </span>
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden">
        <ApplicationsMobileList
          applications={filteredApplications}
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
