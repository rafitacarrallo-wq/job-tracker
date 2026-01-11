"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/shared/company-logo";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ApplicationStatus } from "@/types";

interface RecentApplication {
  id: string;
  company: string;
  companyDomain: string | null;
  position: string;
  status: ApplicationStatus;
  applicationDate: string;
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

export function RecentApplications({
  applications,
}: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Applications</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/applications">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No applications yet
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 rounded-lg p-2"
              >
                <CompanyLogo
                  company={app.company}
                  companyDomain={app.companyDomain}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{app.position}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.company}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(app.applicationDate), "MMM d")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
