import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const interaction = await prisma.interaction.create({
      data: {
        contactId: id,
        content: body.content,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(interaction);
  } catch (error) {
    console.error("Error creating interaction:", error);
    return NextResponse.json(
      { error: "Failed to create interaction" },
      { status: 500 }
    );
  }
}
