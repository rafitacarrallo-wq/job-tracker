"use client";

import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  Calendar,
  Target,
  Award,
  Bookmark,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalApplications: number;
    savedCount: number;
    thisWeek: number;
    responseRate: number;
    pendingInterviews: number;
    activeApplications: number;
    offers: number;
    watchlistCount: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Applied",
      description: "Total sent applications",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Saved",
      description: "Ready to apply",
      value: stats.savedCount,
      icon: Clock,
      color: "text-slate-600",
      bgColor: "bg-slate-100 dark:bg-slate-800/50",
    },
    {
      title: "This Week",
      description: "Applied this week",
      value: stats.thisWeek,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Response Rate",
      description: "Got a response",
      value: `${stats.responseRate}%`,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Interviews",
      description: "Pending interviews",
      value: stats.pendingInterviews,
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Active",
      description: "In progress",
      value: stats.activeApplications,
      icon: Target,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "Offers",
      description: "Received offers",
      value: stats.offers,
      icon: Award,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Watchlist",
      description: "Companies to track",
      value: stats.watchlistCount,
      icon: Bookmark,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-3xl font-bold tracking-tight md:text-4xl">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className={`rounded-xl p-2.5 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 md:h-6 md:w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
