"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "./stats-cards";
import { UpcomingActions } from "./upcoming-actions";
import { RecentApplications } from "./recent-applications";

interface DashboardData {
  stats: {
    totalApplications: number;
    savedCount: number;
    thisWeek: number;
    responseRate: number;
    pendingInterviews: number;
    activeApplications: number;
    offers: number;
    watchlistCount: number;
    pendingTasksCount: number;
  };
  upcomingActions: Array<{
    id: string;
    company: string;
    companyDomain: string | null;
    position: string;
    nextStep: string | null;
    nextStepDate: string;
  }>;
  upcomingReminders: Array<{
    id: string;
    title: string;
    dueDate: string;
    contact: {
      id: string;
      name: string;
      company: string | null;
    };
  }>;
  upcomingTasks: Array<{
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
  }>;
  recentApplications: Array<{
    id: string;
    company: string;
    companyDomain: string | null;
    position: string;
    status: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ARCHIVED";
    applicationDate: string;
  }>;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/stats");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Overview of your job search progress
        </p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <UpcomingActions
          actions={data.upcomingActions}
          reminders={data.upcomingReminders}
          tasks={data.upcomingTasks}
        />
        <RecentApplications applications={data.recentApplications} />
      </div>
    </div>
  );
}
