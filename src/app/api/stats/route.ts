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

    // Saved applications (not yet applied)
    const savedCount = applications.filter(
      (app: Application) => app.status === "SAVED"
    ).length;

    // Total applications (only actually applied: APPLIED, INTERVIEW, OFFER, REJECTED)
    // Excludes SAVED and ARCHIVED
    const totalApplications = applications.filter((app: Application) =>
      ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(app.status)
    ).length;

    // Applications this week (only applied ones, not saved)
    const thisWeek = applications.filter((app: Application) => {
      if (app.status === "SAVED") return false;
      const date = new Date(app.applicationDate);
      return date >= weekStart && date <= weekEnd;
    }).length;

    // Response rate (anything beyond APPLIED)
    const responded = applications.filter((app: Application) =>
      ["INTERVIEW", "OFFER", "REJECTED"].includes(app.status)
    ).length;
    const applied = applications.filter((app: Application) =>
      ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(app.status)
    ).length;
    const responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;

    // Pending interviews
    const pendingInterviews = applications.filter(
      (app: Application) => app.status === "INTERVIEW"
    ).length;

    // Active applications (only APPLIED + INTERVIEW)
    const activeApplications = applications.filter((app: Application) =>
      ["APPLIED", "INTERVIEW"].includes(app.status)
    ).length;

    // Offers
    const offers = applications.filter(
      (app: Application) => app.status === "OFFER"
    ).length;

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
        companyWebsite: true,
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

    // Get upcoming tasks (not completed, sorted by due date)
    const upcomingTasks = await prisma.task.findMany({
      where: {
        completed: false,
      },
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
      take: 15,
      include: {
        application: {
          select: {
            id: true,
            company: true,
            position: true,
            companyWebsite: true,
          },
        },
        watchlist: {
          select: {
            id: true,
            name: true,
            careersUrl: true,
          },
        },
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    // Count pending tasks
    const pendingTasksCount = await prisma.task.count({
      where: {
        completed: false,
      },
    });

    // Recent applications (exclude SAVED - those are shown separately)
    const recentApplications = await prisma.application.findMany({
      where: {
        status: {
          notIn: ["SAVED"],
        },
      },
      orderBy: {
        applicationDate: "desc",
      },
      take: 5,
      select: {
        id: true,
        company: true,
        companyWebsite: true,
        position: true,
        status: true,
        applicationDate: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalApplications,
        savedCount,
        thisWeek,
        responseRate,
        pendingInterviews,
        activeApplications,
        offers,
        watchlistCount,
        pendingTasksCount,
      },
      upcomingActions,
      upcomingReminders,
      upcomingTasks,
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
