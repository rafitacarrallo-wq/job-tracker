import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const application = await prisma.application.update({
      where: { id },
      data: {
        company: body.company,
        companyDomain: body.companyDomain,
        companyLogo: body.companyLogo,
        position: body.position,
        applicationDate: body.applicationDate
          ? new Date(body.applicationDate)
          : undefined,
        status: body.status,
        jobUrl: body.jobUrl,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        salaryExpected: body.salaryExpected,
        interestLevel: body.interestLevel,
        source: body.source,
        notes: body.notes,
        nextStep: body.nextStep,
        nextStepDate: body.nextStepDate ? new Date(body.nextStepDate) : null,
        cvVersion: body.cvVersion,
        coverLetter: body.coverLetter,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
