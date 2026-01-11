import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const company = await prisma.watchlistCompany.update({
      where: { id },
      data: {
        name: body.name,
        domain: body.domain,
        logo: body.logo,
        notes: body.notes,
        careersUrl: body.careersUrl,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error updating watchlist company:", error);
    return NextResponse.json(
      { error: "Failed to update watchlist company" },
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
    await prisma.watchlistCompany.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting watchlist company:", error);
    return NextResponse.json(
      { error: "Failed to delete watchlist company" },
      { status: 500 }
    );
  }
}
