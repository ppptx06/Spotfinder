import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SpotFinder Database...");

  // 1. Clean existing records
  await prisma.review.deleteMany();
  await prisma.library.deleteMany();
  await prisma.cafe.deleteMany();
  await prisma.studyRoom.deleteMany();
  await prisma.wifiInfo.deleteMany();
  await prisma.outlet.deleteMany();
  await prisma.seating.deleteMany();
  await prisma.noiseLevel.deleteMany();
  await prisma.studySpot.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Администратор SpotFinder",
      email: "admin@spotfinder.kz",
      passwordHash: "admin123",
      userType: "ADMIN",
      isVerified: true,
      adminProfile: {
        create: {
          accessLevel: "SUPERADMIN",
        },
      },
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: "Ибрахим Нұрғали",
      email: "student@astanait.edu.kz",
      passwordHash: "student123",
      userType: "STUDENT",
      isVerified: true,
    },
  });

  const remoteUser = await prisma.user.create({
    data: {
      name: "Багымжан О.",
      email: "remote@astanait.edu.kz",
      passwordHash: "remote123",
      userType: "REMOTE_WORKER",
      isVerified: true,
    },
  });

  const schoolUser = await prisma.user.create({
    data: {
      name: "Алижан К.",
      email: "school@astanait.edu.kz",
      passwordHash: "school123",
      userType: "HIGH_SCHOOL_STUDENT",
      isVerified: true,
    },
  });

  // 3. Create StudySpots
  // Spot 1: AITU
  const aitu = await prisma.studySpot.create({
    data: {
      id: 1,
      name: "AITU Central Library & Coworking",
      address: "ул. Мангилик Ел, С1, Астана (EXPO)",
      operatingHours: "08:00 - 22:00",
      latitude: 51.0908,
      longitude: 71.4183,
      overallRating: 4.9,
      spotType: "library",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
      library: {
        create: {
          silentStudyArea: true,
          bookReservation: true,
          publicAccess: false,
          floorCount: 2,
          campusAffiliation: "Astana IT University",
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 180,
          securityType: "AITU-Student (WPA2)",
          qualityRating: 5,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 32,
          totalSeats: 120,
          comfortLevel: "Эргономичные кресла и пуфы",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 32,
          noiseCategory: "SILENT",
        },
      },
      outlets: {
        create: [
          { type: "EU Standard 220V", count: 48, accessible: true, isWorking: true },
          { type: "USB-C Fast Charging", count: 24, accessible: true, isWorking: true },
        ],
      },
      reviews: {
        create: [
          {
            userId: studentUser.id,
            authorName: "Алихан С.",
            rating: 5,
            comment: "Лучшее место для подготовки к сессии. В silent-зоне идеальная тишина, розетка у каждого стола.",
          },
          {
            userId: remoteUser.id,
            authorName: "Мадина Б.",
            rating: 5,
            comment: "Wi-Fi летает, но после 17:00 все места у окна обычно заняты.",
          },
        ],
      },
    },
  });

  // Spot 2: NU Library
  await prisma.studySpot.create({
    data: {
      id: 2,
      name: "Nazarbayev University Main Library",
      address: "пр. Кабанбай батыра, 53, Астана",
      operatingHours: "24/7 (для студентов)",
      latitude: 51.0901,
      longitude: 71.3985,
      overallRating: 4.9,
      spotType: "library",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      library: {
        create: {
          silentStudyArea: true,
          bookReservation: true,
          publicAccess: false,
          floorCount: 3,
          campusAffiliation: "Nazarbayev University",
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 250,
          securityType: "NU-Secure (eduroam)",
          qualityRating: 5,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 65,
          totalSeats: 350,
          comfortLevel: "Индивидуальные кабинки (Carrels)",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 28,
          noiseCategory: "SILENT",
        },
      },
      outlets: {
        create: [{ type: "EU Standard", count: 200, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: studentUser.id,
            authorName: "Данияр К.",
            rating: 5,
            comment: "Кабинки на 3 этаже — топ для написания диплома или кодинга.",
          },
        ],
      },
    },
  });

  // Spot 3: Espresso Bar
  await prisma.studySpot.create({
    data: {
      id: 3,
      name: "Espresso Bar & Workspace",
      address: "ул. Достык, 16, БЦ Talan Towers, Астана",
      operatingHours: "07:30 - 23:00",
      latitude: 51.1282,
      longitude: 71.4305,
      overallRating: 4.7,
      spotType: "cafe",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      cafe: {
        create: {
          outletAvailability: "ABUNDANT",
          avgCoffeePrice: 1400,
          minOrderRequired: true,
          hasFoodMenu: true,
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 95,
          securityType: "EspressoGuest (Open)",
          qualityRating: 4,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 8,
          totalSeats: 35,
          comfortLevel: "Мягкие диваны и высокие барные стойки",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 48,
          noiseCategory: "QUIET",
        },
      },
      outlets: {
        create: [{ type: "EU 220V", count: 18, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: remoteUser.id,
            authorName: "Айсулу М.",
            rating: 5,
            comment: "Отличный раф, негромкий Lo-Fi на фоне, можно комфортно поработать с ноутбуком пару часов.",
          },
        ],
      },
    },
  });

  // Spot 4: SmArt.Point
  await prisma.studySpot.create({
    data: {
      id: 4,
      name: "SmArt.Point Coworking Study Room",
      address: "ул. Достык, 5, Астана",
      operatingHours: "09:00 - 21:00",
      latitude: 51.1325,
      longitude: 71.4241,
      overallRating: 4.8,
      spotType: "studyRoom",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      studyRoom: {
        create: {
          maxCapacity: 14,
          reservationPolicy: "Бронь через приложение за 1 час",
          hasWhiteboard: true,
          hasProjector: true,
          hourlyRate: 1500,
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 300,
          securityType: "SmArtPoint-5G",
          qualityRating: 5,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 6,
          totalSeats: 14,
          comfortLevel: "Herman Miller анатомические кресла",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 35,
          noiseCategory: "QUIET",
        },
      },
      outlets: {
        create: [{ type: "Type-C & EU", count: 28, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: studentUser.id,
            authorName: "Ерлан Т.",
            rating: 5,
            comment: "Брали с командой для хакатона. Маркерная доска отличная, интернет суперстабильный.",
          },
        ],
      },
    },
  });

  // Spot 5: National Academic Library
  await prisma.studySpot.create({
    data: {
      id: 5,
      name: "Национальная Академическая Библиотека РК",
      address: "ул. Достык, 11, Астана",
      operatingHours: "09:00 - 20:00 (Пн-Сб)",
      latitude: 51.1271,
      longitude: 71.4222,
      overallRating: 4.6,
      spotType: "library",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      library: {
        create: {
          silentStudyArea: true,
          bookReservation: true,
          publicAccess: true,
          floorCount: 5,
          campusAffiliation: "Городская библиотека",
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 50,
          securityType: "NAB-Free",
          qualityRating: 4,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 45,
          totalSeats: 250,
          comfortLevel: "Классические деревянные столы",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 25,
          noiseCategory: "SILENT",
        },
      },
      outlets: {
        create: [{ type: "EU 220V", count: 80, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: studentUser.id,
            authorName: "Нурсултан И.",
            rating: 5,
            comment: "Абсолютная тишина, читательский билет оформляется за 2 минуты.",
          },
        ],
      },
    },
  });

  // Spot 6: Astana Hub
  await prisma.studySpot.create({
    data: {
      id: 6,
      name: "Astana Hub Coworking & Media Lab",
      address: "пр. Мангилик Ел, 55/8, Павильон C4.6, Астана",
      operatingHours: "24/7 (для резидентов и студентов)",
      latitude: 51.0886,
      longitude: 71.415,
      overallRating: 4.9,
      spotType: "studyRoom",
      imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
      studyRoom: {
        create: {
          maxCapacity: 50,
          reservationPolicy: "Свободный вход для IT-студентов",
          hasWhiteboard: true,
          hasProjector: true,
          hourlyRate: 0,
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 400,
          securityType: "AstanaHub-Guest (High-Speed)",
          qualityRating: 5,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 22,
          totalSeats: 70,
          comfortLevel: "Современные рабочие зоны и капсулы для звонков",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 38,
          noiseCategory: "QUIET",
        },
      },
      outlets: {
        create: [{ type: "EU Standard 220V + USB", count: 90, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: studentUser.id,
            authorName: "Багымжан О.",
            rating: 5,
            comment: "Топ атмосфера, стартап-комьюнити, рядом с AITU.",
          },
        ],
      },
    },
  });

  // Spot 7: Zebra Coffee
  await prisma.studySpot.create({
    data: {
      id: 7,
      name: "Zebra Coffee & Study Corner",
      address: "пр. Кабанбай батыра, 40, Астана",
      operatingHours: "08:00 - 00:00",
      latitude: 51.1092,
      longitude: 71.4121,
      overallRating: 4.6,
      spotType: "cafe",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      cafe: {
        create: {
          outletAvailability: "ABUNDANT",
          avgCoffeePrice: 1100,
          minOrderRequired: false,
          hasFoodMenu: true,
        },
      },
      wifiInfo: {
        create: {
          speedMbps: 80,
          securityType: "Zebra-WiFi",
          qualityRating: 4,
          isFree: true,
        },
      },
      seating: {
        create: {
          availableSeats: 12,
          totalSeats: 30,
          comfortLevel: "Уютные круглые столики и розетки вдоль стены",
        },
      },
      noiseLevel: {
        create: {
          decibelLevel: 45,
          noiseCategory: "QUIET",
        },
      },
      outlets: {
        create: [{ type: "EU 220V", count: 22, accessible: true, isWorking: true }],
      },
      reviews: {
        create: [
          {
            userId: schoolUser.id,
            authorName: "Ализат М.",
            rating: 5,
            comment: "Вкусный кофе, доступные цены для студентов и тихо утром.",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with Users (Admin, Student, RemoteWorker, SchoolStudent) and 7 StudySpots!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
