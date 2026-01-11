"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ApplicationCard } from "./application-card";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";
import { APPLICATION_STATUSES } from "@/types";

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({
  status,
  applications,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const statusConfig = APPLICATION_STATUSES.find((s) => s.value === status);

  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 border-b p-3">
        <div className={cn("h-2 w-2 rounded-full", statusConfig?.color)} />
        <h3 className="font-medium">{statusConfig?.label}</h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {applications.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 space-y-2 overflow-y-auto p-2",
              snapshot.isDraggingOver && "bg-muted/80"
            )}
          >
            {applications.map((application, index) => (
              <Draggable
                key={application.id}
                draggableId={application.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ApplicationCard
                      application={application}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
