import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.watchlistCompany.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const company = await prisma.watchlistCompany.create({
      data: {
        name: body.name,
        logo: body.logo || null,
        notes: body.notes || null,
        careersUrl: body.careersUrl || null,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error creating watchlist company:", error);
    return NextResponse.json(
      { error: "Failed to create watchlist company" },
      { status: 500 }
    );
  }
}
