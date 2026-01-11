"use client";

import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  Calendar,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalApplications: number;
    thisWeek: number;
    responseRate: number;
    pendingInterviews: number;
    activeApplications: number;
    offers: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Interviews",
      value: stats.pendingInterviews,
      icon: Calendar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Active",
      value: stats.activeApplications,
      icon: Target,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Award,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`rounded-lg p-1.5 md:p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 md:h-5 md:w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold md:text-2xl">{card.value}</p>
                <p className="truncate text-[10px] text-muted-foreground md:text-xs">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
