import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const application = await prisma.application.create({
      data: {
        company: body.company,
        companyDomain: body.companyDomain || null,
        companyLogo: body.companyLogo || null,
        position: body.position,
        applicationDate: body.applicationDate
          ? new Date(body.applicationDate)
          : new Date(),
        status: body.status || "SAVED",
        jobUrl: body.jobUrl || null,
        salaryMin: body.salaryMin || null,
        salaryMax: body.salaryMax || null,
        salaryExpected: body.salaryExpected || null,
        interestLevel: body.interestLevel || 3,
        source: body.source || "OTHER",
        notes: body.notes || null,
        nextStep: body.nextStep || null,
        nextStepDate: body.nextStepDate ? new Date(body.nextStepDate) : null,
        cvVersion: body.cvVersion || null,
        coverLetter: body.coverLetter || null,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
