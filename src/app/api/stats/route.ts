import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";
import type { Application } from "@prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Get all applications
    const applications = await prisma.application.findMany();

    // Total applications
    const totalApplications = applications.length;

    // Applications this week
    const thisWeek = applications.filter((app: Application) => {
      const date = new Date(app.applicationDate);
      return date >= weekStart && date <= weekEnd;
    }).length;

    // Response rate (anything beyond APPLIED)
    const responded = applications.filter((app: Application) =>
      ["INTERVIEW", "OFFER", "REJECTED"].includes(app.status)
    ).length;
    const applied = applications.filter((app: Application) => app.status !== "SAVED").length;
    const responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;

    // Pending interviews
    const pendingInterviews = applications.filter(
      (app: Application) => app.status === "INTERVIEW"
    ).length;

    // Active applications (not rejected/archived)
    const activeApplications = applications.filter(
      (app: Application) => !["REJECTED", "ARCHIVED"].includes(app.status)
    ).length;

    // Offers
    const offers = applications.filter((app: Application) => app.status === "OFFER").length;

    // Watchlist count (saved companies not yet applied to)
    const watchlistCount = await prisma.watchlistCompany.count();

    // Get upcoming actions (next steps with dates)
    const upcomingActions = await prisma.application.findMany({
      where: {
        nextStepDate: {
          gte: now,
        },
        status: {
          notIn: ["REJECTED", "ARCHIVED"],
        },
      },
      orderBy: {
        nextStepDate: "asc",
      },
      take: 10,
      select: {
        id: true,
        company: true,
        companyDomain: true,
        position: true,
        nextStep: true,
        nextStepDate: true,
      },
    });

    // Get upcoming reminders
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        dueDate: {
          gte: now,
        },
        completed: false,
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 10,
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    // Recent applications
    const recentApplications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        company: true,
        companyDomain: true,
        position: true,
        status: true,
        applicationDate: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalApplications,
        thisWeek,
        responseRate,
        pendingInterviews,
        activeApplications,
        offers,
        watchlistCount,
      },
      upcomingActions,
      upcomingReminders,
      recentApplications,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
