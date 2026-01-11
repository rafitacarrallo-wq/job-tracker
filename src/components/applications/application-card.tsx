"use client";

import { format } from "date-fns";
import { Calendar, ExternalLink, MoreHorizontal } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { StarRating } from "@/components/shared/star-rating";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  isDragging,
}: ApplicationCardProps) {
  return (
    <div
      className={`group cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md ${
        isDragging ? "rotate-2 shadow-lg" : ""
      }`}
      onClick={() => onEdit(application)}
    >
      <div className="flex items-start gap-3">
        <CompanyLogo
          company={application.company}
          domain={application.companyDomain}
          logo={application.companyLogo}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
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
                  className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100"
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

          <div className="mt-2 flex items-center justify-between">
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
    </div>
  );
}
