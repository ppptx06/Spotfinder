import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const noise = searchParams.get("noise");
    const minWifi = searchParams.get("minWifi");

    const where: any = {};
    if (type && type !== "all") {
      where.spotType = type;
    }

    const spots = await prisma.studySpot.findMany({
      where,
      include: {
        library: true,
        cafe: true,
        studyRoom: true,
        wifiInfo: true,
        seating: true,
        noiseLevel: true,
        outlets: true,
        reviews: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    let result = spots.map((s) => ({
      ...s,
      reviews: s.reviews.map((r) => ({
        ...r,
        timestamp: new Date(r.timestamp).toLocaleDateString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    }));

    if (noise && noise !== "ALL") {
      result = result.filter((s) => s.noiseLevel?.noiseCategory === noise);
    }

    if (minWifi) {
      const speed = parseFloat(minWifi);
      if (!isNaN(speed) && speed > 0) {
        result = result.filter((s) => (s.wifiInfo?.speedMbps || 0) >= speed);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching spots:", error);
    return NextResponse.json(
      { error: "Failed to fetch spots from database" },
      { status: 500 }
    );
  }
}

// POST: Add new study spot (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      operatingHours,
      latitude,
      longitude,
      spotType,
      imageUrl,
      wifiSpeed,
      totalSeats,
      noiseCategory,
      adminEmail,
    } = body;

    // Verify admin
    if (adminEmail) {
      const user = await prisma.user.findUnique({
        where: { email: adminEmail },
      });
      if (!user || user.userType !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const created = await prisma.studySpot.create({
      data: {
        name,
        address,
        operatingHours: operatingHours || "09:00 - 22:00",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        overallRating: 5.0,
        spotType: spotType || "library",
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
        wifiInfo: {
          create: {
            speedMbps: wifiSpeed ? parseFloat(wifiSpeed) : 100,
            isFree: true,
            qualityRating: 5,
          },
        },
        seating: {
          create: {
            availableSeats: totalSeats ? parseInt(totalSeats) : 20,
            totalSeats: totalSeats ? parseInt(totalSeats) : 30,
            comfortLevel: "Стандартные удобные рабочие места",
          },
        },
        noiseLevel: {
          create: {
            noiseCategory: noiseCategory || "QUIET",
            decibelLevel: 35,
          },
        },
        outlets: {
          create: [{ type: "EU 220V", count: 15, accessible: true, isWorking: true }],
        },
        ...(spotType === "library"
          ? {
              library: {
                create: {
                  silentStudyArea: true,
                  bookReservation: true,
                  publicAccess: true,
                  floorCount: 2,
                },
              },
            }
          : spotType === "cafe"
          ? {
              cafe: {
                create: {
                  outletAvailability: "ABUNDANT",
                  avgCoffeePrice: 1200,
                  minOrderRequired: false,
                  hasFoodMenu: true,
                },
              },
            }
          : {
              studyRoom: {
                create: {
                  maxCapacity: 20,
                  hourlyRate: 1000,
                  hasWhiteboard: true,
                  hasProjector: true,
                },
              },
            }),
      },
      include: {
        library: true,
        cafe: true,
        studyRoom: true,
        wifiInfo: true,
        seating: true,
        noiseLevel: true,
        outlets: true,
        reviews: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating spot:", error);
    return NextResponse.json({ error: "Failed to create spot" }, { status: 500 });
  }
}

// DELETE: Delete spot (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const adminEmail = searchParams.get("adminEmail");

    if (!id) {
      return NextResponse.json({ error: "Missing spot id" }, { status: 400 });
    }

    if (adminEmail) {
      const user = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (!user || user.userType !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    await prisma.studySpot.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting spot:", error);
    return NextResponse.json({ error: "Failed to delete spot" }, { status: 500 });
  }
}
