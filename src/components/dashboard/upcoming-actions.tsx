"use client";

import Link from "next/link";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/shared/company-logo";

interface UpcomingAction {
  id: string;
  company: string;
  companyDomain: string | null;
  position: string;
  nextStep: string | null;
  nextStepDate: string;
}

interface UpcomingReminder {
  id: string;
  title: string;
  dueDate: string;
  contact: {
    id: string;
    name: string;
    company: string | null;
  };
}

interface UpcomingActionsProps {
  actions: UpcomingAction[];
  reminders: UpcomingReminder[];
}

function getDateLabel(date: Date): { label: string; urgent: boolean } {
  if (isPast(date) && !isToday(date)) {
    return { label: "Overdue", urgent: true };
  }
  if (isToday(date)) {
    return { label: "Today", urgent: true };
  }
  if (isTomorrow(date)) {
    return { label: "Tomorrow", urgent: false };
  }
  return { label: format(date, "MMM d"), urgent: false };
}

export function UpcomingActions({ actions, reminders }: UpcomingActionsProps) {
  const allItems = [
    ...actions.map((a) => ({
      type: "action" as const,
      id: a.id,
      date: new Date(a.nextStepDate),
      data: a,
    })),
    ...reminders.map((r) => ({
      type: "reminder" as const,
      id: r.id,
      date: new Date(r.dueDate),
      data: r,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upcoming Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming actions scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {allItems.slice(0, 8).map((item) => {
              const dateInfo = getDateLabel(item.date);

              if (item.type === "action") {
                const action = item.data as UpcomingAction;
                return (
                  <Link
                    key={`action-${item.id}`}
                    href="/applications"
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <CompanyLogo
                      company={action.company}
                      domain={action.companyDomain}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {action.nextStep}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.company} - {action.position}
                      </p>
                    </div>
                    <Badge
                      variant={dateInfo.urgent ? "destructive" : "secondary"}
                      className="flex-shrink-0"
                    >
                      {dateInfo.urgent && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {dateInfo.label}
                    </Badge>
                  </Link>
                );
              } else {
                const reminder = item.data as UpcomingReminder;
                return (
                  <Link
                    key={`reminder-${item.id}`}
                    href="/contacts"
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {reminder.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {reminder.contact.name}
                        {reminder.contact.company &&
                          ` at ${reminder.contact.company}`}
                      </p>
                    </div>
                    <Badge
                      variant={dateInfo.urgent ? "destructive" : "secondary"}
                      className="flex-shrink-0"
                    >
                      {dateInfo.urgent && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {dateInfo.label}
                    </Badge>
                  </Link>
                );
              }
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
