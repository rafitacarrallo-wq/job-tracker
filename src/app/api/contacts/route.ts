import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        interactions: {
          orderBy: { date: "desc" },
          take: 5,
        },
        reminders: {
          where: { completed: false },
          orderBy: { dueDate: "asc" },
        },
        applications: {
          include: {
            application: true,
          },
        },
      },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        company: body.company || null,
        position: body.position || null,
        linkedinUrl: body.linkedinUrl || null,
        email: body.email || null,
        phone: body.phone || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
