import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spotId, delta, absoluteSeats } = body;

    const id = parseInt(spotId);
    const existing = await prisma.seating.findUnique({ where: { spotId: id } });

    if (!existing) {
      return NextResponse.json({ error: "Seating not found" }, { status: 404 });
    }

    let newAvailable: number;
    if (absoluteSeats !== undefined) {
      newAvailable = Math.max(0, Math.min(existing.totalSeats, parseInt(absoluteSeats)));
    } else {
      newAvailable = Math.max(0, Math.min(existing.totalSeats, existing.availableSeats + parseInt(delta || 0)));
    }

    const updated = await prisma.seating.update({
      where: { spotId: id },
      data: { availableSeats: newAvailable },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating seating:", error);
    return NextResponse.json({ error: "Failed to update seats" }, { status: 500 });
  }
}
