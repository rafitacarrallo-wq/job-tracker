"use client";

import { format } from "date-fns";
import { ExternalLink, MoreHorizontal, Calendar } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { WatchlistCompany } from "@/types";

interface CompanyCardProps {
  company: WatchlistCompany;
  onEdit: (company: WatchlistCompany) => void;
  onDelete: (id: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onEdit(company)}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <CompanyLogo
              company={company.name}
              domain={company.domain}
              logo={company.logo}
              size="md"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">{company.name}</h3>
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 shrink-0" />
                <span className="truncate">Added {format(new Date(company.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 md:opacity-0 md:group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(company)}>
                Edit
              </DropdownMenuItem>
              {company.careersUrl && (
                <DropdownMenuItem asChild>
                  <a
                    href={company.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Careers
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(company.id)}
                className="text-destructive"
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {company.notes && (
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground line-clamp-2">
            {company.notes}
          </p>
        )}

        {company.careersUrl && (
          <a
            href={company.careersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 md:mt-3 inline-flex items-center gap-1 text-xs md:text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Careers Page
          </a>
        )}
      </CardContent>
    </Card>
  );
}
