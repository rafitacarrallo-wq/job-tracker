import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    const watchlistId = searchParams.get("watchlistId");
    const contactId = searchParams.get("contactId");
    const completed = searchParams.get("completed");
    const includeNextSteps = searchParams.get("includeNextSteps") !== "false";

    const where: Record<string, unknown> = {};

    if (applicationId) {
      where.applicationId = applicationId;
    }
    if (watchlistId) {
      where.watchlistId = watchlistId;
    }
    if (contactId) {
      where.contactId = contactId;
    }
    if (completed !== null) {
      where.completed = completed === "true";
    }

    const tasks = await prisma.task.findMany({
      where,
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
      orderBy: [
        { completed: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Add type to regular tasks
    const tasksWithType = tasks.map((task) => ({
      ...task,
      type: "task" as const,
    }));

    // If includeNextSteps and no specific entity filter, also fetch application next steps
    if (includeNextSteps && !applicationId && !watchlistId && !contactId) {
      const applicationsWithNextSteps = await prisma.application.findMany({
        where: {
          nextStep: { not: null },
          nextStepDate: { not: null },
          status: { notIn: ["REJECTED", "ARCHIVED"] },
        },
        select: {
          id: true,
          company: true,
          companyWebsite: true,
          position: true,
          nextStep: true,
          nextStepDate: true,
          jobUrl: true,
        },
      });

      // Transform next steps into task-like items
      const nextStepItems = applicationsWithNextSteps.map((app) => ({
        id: `nextstep-${app.id}`,
        title: app.nextStep!,
        description: null,
        dueDate: app.nextStepDate,
        completed: false,
        link: app.jobUrl,
        applicationId: app.id,
        watchlistId: null,
        contactId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "nextStep" as const,
        application: {
          id: app.id,
          company: app.company,
          position: app.position,
          companyWebsite: app.companyWebsite,
        },
        watchlist: null,
        contact: null,
      }));

      // Combine and sort by: completed first, then due date, then created date
      const allItems = [...tasksWithType, ...nextStepItems].sort((a, b) => {
        // Completed items go last
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Sort by due date (nulls last)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        // Then by created date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return NextResponse.json(allItems);
    }

    return NextResponse.json(tasksWithType);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        completed: body.completed || false,
        link: body.link || null,
        applicationId: body.applicationId || null,
        watchlistId: body.watchlistId || null,
        contactId: body.contactId || null,
      },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            position: true,
          },
        },
        watchlist: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
