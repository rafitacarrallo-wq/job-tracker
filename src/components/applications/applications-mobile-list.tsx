"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, ExternalLink } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { StarRating } from "@/components/shared/star-rating";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/types";

interface ApplicationsMobileListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationsMobileList({
  applications,
  onEdit,
  onDelete,
}: ApplicationsMobileListProps) {
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | "ALL">("ALL");

  const filteredApplications =
    activeFilter === "ALL"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  const getStatusCount = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status).length;

  return (
    <div className="flex flex-col">
      {/* Status Filter Tabs */}
      <div className="sticky top-0 z-10 -mx-4 overflow-x-auto border-b bg-background px-4">
        <div className="flex gap-1 py-2">
          <Button
            variant={activeFilter === "ALL" ? "default" : "ghost"}
            size="sm"
            className="h-8 shrink-0 rounded-full px-3 text-xs"
            onClick={() => setActiveFilter("ALL")}
          >
            All ({applications.length})
          </Button>
          {APPLICATION_STATUSES.map((status) => {
            const count = getStatusCount(status.value);
            return (
              <Button
                key={status.value}
                variant={activeFilter === status.value ? "default" : "ghost"}
                size="sm"
                className="h-8 shrink-0 rounded-full px-3 text-xs"
                onClick={() => setActiveFilter(status.value)}
              >
                {status.label} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y">
        {filteredApplications.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No applications in this category
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="flex cursor-pointer items-start gap-3 py-4"
              onClick={() => onEdit(application)}
            >
              <CompanyLogo
                company={application.company}
                companyDomain={application.companyDomain}
                size="sm"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium leading-tight">
                      {application.position}
                    </h4>
                    <p className="truncate text-sm text-muted-foreground">
                      {application.company}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(application)}>
                        Edit
                      </DropdownMenuItem>
                      {application.jobUrl && (
                        <DropdownMenuItem asChild>
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Job Link
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(application.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={application.status} />
                  <StarRating value={application.interestLevel} readonly size="sm" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(application.applicationDate), "MMM d")}
                  </div>
                </div>

                {application.nextStep && (
                  <div className="mt-2 rounded bg-muted px-2 py-1 text-xs">
                    <span className="font-medium">Next:</span> {application.nextStep}
                    {application.nextStepDate && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({format(new Date(application.nextStepDate), "MMM d")})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
