import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Add review to spot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spotId, authorName, rating, comment, userEmail } = body;

    let userId: number | undefined;
    if (userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (user) userId = user.id;
    }

    const review = await prisma.review.create({
      data: {
        spotId: parseInt(spotId),
        userId,
        authorName: authorName || "Студент",
        rating: parseFloat(rating),
        comment: comment || "",
      },
    });

    // Recalculate average rating for the spot
    const allReviews = await prisma.review.findMany({
      where: { spotId: parseInt(spotId) },
    });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await prisma.studySpot.update({
      where: { id: parseInt(spotId) },
      data: { overallRating: Math.round(avg * 10) / 10 },
    });

    return NextResponse.json(
      {
        ...review,
        timestamp: "Только что",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

// DELETE: Delete review (Admin or Author)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const adminEmail = searchParams.get("adminEmail");

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    if (adminEmail) {
      const user = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (!user || user.userType !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
