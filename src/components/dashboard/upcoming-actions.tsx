"use client";

import Link from "next/link";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { User, AlertCircle, CheckSquare } from "lucide-react";
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

interface UpcomingTask {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  link: string | null;
  application: {
    id: string;
    company: string;
    position: string;
    companyDomain: string | null;
  } | null;
  watchlist: {
    id: string;
    name: string;
    careersUrl: string | null;
  } | null;
  contact: {
    id: string;
    name: string;
    company: string | null;
  } | null;
}

interface UpcomingActionsProps {
  actions: UpcomingAction[];
  reminders: UpcomingReminder[];
  tasks: UpcomingTask[];
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

export function UpcomingActions({ actions, reminders, tasks }: UpcomingActionsProps) {
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
    ...tasks.map((t) => ({
      type: "task" as const,
      id: t.id,
      date: t.dueDate ? new Date(t.dueDate) : new Date(9999, 11, 31), // Tasks without due date go to end
      data: t,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming tasks scheduled
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
                      companyDomain={action.companyDomain}
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
              } else if (item.type === "reminder") {
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
              } else {
                // Task
                const task = item.data as UpcomingTask;
                const getTaskContext = () => {
                  if (task.application) {
                    return `${task.application.company} - ${task.application.position}`;
                  }
                  if (task.watchlist) {
                    return task.watchlist.name;
                  }
                  if (task.contact) {
                    return task.contact.name + (task.contact.company ? ` at ${task.contact.company}` : "");
                  }
                  return "General";
                };
                const getTaskHref = () => {
                  if (task.application) return "/applications";
                  if (task.watchlist) return "/watchlist";
                  if (task.contact) return "/contacts";
                  return "/tasks";
                };
                const getTaskIcon = () => {
                  if (task.application) {
                    return (
                      <CompanyLogo
                        company={task.application.company}
                        companyDomain={task.application.companyDomain}
                        size="sm"
                      />
                    );
                  }
                  if (task.watchlist) {
                    return (
                      <CompanyLogo
                        company={task.watchlist.name}
                        companyDomain={task.watchlist.careersUrl}
                        size="sm"
                      />
                    );
                  }
                  if (task.contact) {
                    return (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    );
                  }
                  return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <CheckSquare className="h-4 w-4 text-primary" />
                    </div>
                  );
                };

                // For tasks without due date, don't show date badge
                const hasDate = task.dueDate !== null;

                return (
                  <Link
                    key={`task-${item.id}`}
                    href={getTaskHref()}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    {getTaskIcon()}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getTaskContext()}
                      </p>
                    </div>
                    {hasDate ? (
                      <Badge
                        variant={dateInfo.urgent ? "destructive" : "secondary"}
                        className="flex-shrink-0"
                      >
                        {dateInfo.urgent && (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {dateInfo.label}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex-shrink-0">
                        No date
                      </Badge>
                    )}
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
