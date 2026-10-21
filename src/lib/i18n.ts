// Trilingual Localization System (KK, RU, EN) for SpotFinder
export type Language = "kk" | "ru" | "en";

export const translations = {
  // Navigation Tabs
  tabMap: {
    kk: "Карта",
    ru: "Карта",
    en: "Map",
  },
  tabFilters: {
    kk: "Сүзгілер",
    ru: "Фильтры",
    en: "Filters",
  },
  tabSaved: {
    kk: "Таңдаулылар",
    ru: "Закладки",
    en: "Saved",
  },
  tabProfile: {
    kk: "Профиль",
    ru: "Профиль",
    en: "Profile",
  },
  tabAdmin: {
    kk: "Әкімші",
    ru: "Админ",
    en: "Admin",
  },

  // Header & Search
  cityAstana: {
    kk: "Астана, Қазақстан",
    ru: "Астана, Казахстан",
    en: "Astana, Kazakhstan",
  },
  nearYou: {
    kk: "Сіздің жаныңызда",
    ru: "Рядом с вами",
    en: "Near you",
  },
  searchPlaceholder: {
    kk: "Кітапхана, кафе, коворкинг іздеу...",
    ru: "Поиск библиотеки, кафе, коворкинга...",
    en: "Search library, cafe, coworking...",
  },

  // Categories
  catAll: {
    kk: "Барлығы",
    ru: "Все",
    en: "All",
  },
  catLibraries: {
    kk: "Кітапханалар",
    ru: "Библиотеки",
    en: "Libraries",
  },
  catCafes: {
    kk: "Кафелер",
    ru: "Кафе",
    en: "Cafes",
  },
  catCoworkings: {
    kk: "Коворкингтер",
    ru: "Коворкинги",
    en: "Coworking",
  },

  // Spot List
  spotsFound: {
    kk: "Табылған орындар:",
    ru: "Найдено мест:",
    en: "Spots found:",
  },
  reset: {
    kk: "Қалпына келтіру",
    ru: "Сбросить",
    en: "Reset",
  },
  nothingFound: {
    kk: "Ештеңе табылмады",
    ru: "Ничего не найдено",
    en: "Nothing found",
  },
  nothingFoundHint: {
    kk: "Шу деңгейі немесе Wi-Fi сүзгілерін жеңілдетіп көріңіз",
    ru: "Попробуйте ослабить фильтры по шуму или скорости Wi-Fi",
    en: "Try easing noise or Wi-Fi filters",
  },
  freeSeats: {
    kk: "Бос орындар",
    ru: "Свободные места",
    en: "Available seats",
  },

  // Noise & Metrics
  noiseLabel: {
    kk: "Шу деңгейі",
    ru: "Уровень шума",
    en: "Noise level",
  },
  noiseSilent: {
    kk: "Тыныш",
    ru: "Тихий",
    en: "Silent",
  },
  noiseQuiet: {
    kk: "Орташа",
    ru: "Умеренно",
    en: "Quiet",
  },
  noiseLively: {
    kk: "Жанды",
    ru: "Оживлённо",
    en: "Lively",
  },
  wifiFree: {
    kk: "Тегін",
    ru: "Бесплатный",
    en: "Free",
  },
  wifiPaid: {
    kk: "Ақылы",
    ru: "Платный",
    en: "Paid",
  },
  outletsAvail: {
    kk: "Қолжетімді",
    ru: "Доступны",
    en: "Available",
  },

  // Spot Detail & Actions
  back: {
    kk: "Артқа",
    ru: "Назад",
    en: "Back",
  },
  mapBack: {
    kk: "Карта",
    ru: "Карта",
    en: "Map",
  },
  route2gis: {
    kk: "2ГИС бағыты",
    ru: "Маршрут в 2ГИС",
    en: "Route in 2GIS",
  },
  open2gis: {
    kk: "2ГИС-те ашу",
    ru: "Открыть в 2ГИС",
    en: "Open in 2GIS",
  },
  currentOccupancy: {
    kk: "Қазіргі толымдылық:",
    ru: "Текущая заполненность:",
    en: "Current occupancy:",
  },
  seatsLeft: {
    kk: "орын бос",
    ru: "мест свободно",
    en: "seats available",
  },
  occupiedSeatBtn: {
    kk: "Орын алдым (−1)",
    ru: "Занял место (−1)",
    en: "Took seat (−1)",
  },
  freedSeatBtn: {
    kk: "Орын босады (+1)",
    ru: "Освободилось (+1)",
    en: "Freed seat (+1)",
  },
  seatThanks: {
    kk: "Рахмет! Мәртебеңіз басқа студенттерге жіберілді.",
    ru: "Спасибо! Ваш статус отправлен другим студентам.",
    en: "Thank you! Your status is shared with others.",
  },
  leaveReview: {
    kk: "Пікір қалдыру",
    ru: "Оставить отзыв",
    en: "Leave a review",
  },
  yourComment: {
    kk: "Сіздің пікіріңіз...",
    ru: "Ваш комментарий...",
    en: "Your comment...",
  },
  reviewAdded: {
    kk: "Пікір қосылды! Қосқан үлесіңізге рахмет.",
    ru: "Отзыв добавлен! Спасибо за вклад.",
    en: "Review added! Thank you for sharing.",
  },
  reviewsList: {
    kk: "Студенттердің пікірлері",
    ru: "Отзывы студентов",
    en: "Student Reviews",
  },
  justNow: {
    kk: "Жаңа ғана",
    ru: "Только что",
    en: "Just now",
  },

  // Filters Modal
  filtersTitle: {
    kk: "Оқуға арналған сүзгілер",
    ru: "Фильтры для учёбы",
    en: "Study Filters",
  },
  done: {
    kk: "Дайын",
    ru: "Готово",
    en: "Done",
  },
  wifiSpeed: {
    kk: "Wi-Fi жылдамдығы",
    ru: "Скорость Wi-Fi",
    en: "Wi-Fi Speed",
  },
  any: {
    kk: "Кез келген",
    ru: "Любая",
    en: "Any",
  },
  manyOutlets: {
    kk: "Көптеген бос розеткалар",
    ru: "Много свободных розеток",
    en: "Abundant outlets",
  },
  freeEntrance: {
    kk: "Тегін кіру (тапсырыссыз)",
    ru: "Бесплатный вход (без заказа)",
    en: "Free entry (no order req.)",
  },
  showResults: {
    kk: "Нәтижелерді көрсету",
    ru: "Показать результаты",
    en: "Show results",
  },

  // Saved View
  savedTitle: {
    kk: "Сақталған орындар",
    ru: "Сохранённые места",
    en: "Saved Spots",
  },
  noSaved: {
    kk: "Сақталған орындар жоқ",
    ru: "Нет сохранённых мест",
    en: "No saved spots",
  },
  noSavedHint: {
    kk: "Осында сақтау үшін карточкадағы бетбелгі белгішесін басыңыз.",
    ru: "Нажмите на закладку в карточке места, чтобы сохранить его здесь.",
    en: "Tap the bookmark icon on any spot card to save it here.",
  },

  // Profile View
  profileTitle: {
    kk: "Пайдаланушы профилі",
    ru: "Профиль пользователя",
    en: "User Profile",
  },
  roleType: {
    kk: "Профиль түрі",
    ru: "Тип профиля",
    en: "Profile Role",
  },
  student: {
    kk: "Студент",
    ru: "Студент",
    en: "Student",
  },
  remoteWorker: {
    kk: "Қашықтан жұмысшы",
    ru: "Удалёнщик",
    en: "Remote Worker",
  },
  schoolStudent: {
    kk: "Мектеп оқушысы",
    ru: "Школьник",
    en: "High School",
  },
  adminRole: {
    kk: "Жүйе әкімшісі (Admin)",
    ru: "Администратор системы (Admin)",
    en: "System Administrator (Admin)",
  },
  verifiedStudentBadge: {
    kk: "Студент расталды (Student ID)",
    ru: "Студент подтверждён (Student ID)",
    en: "Student Verified (Student ID)",
  },
  adminBadge: {
    kk: "Басқару құқығы бар",
    ru: "Полные права управления",
    en: "Full management access",
  },
  studentData: {
    kk: "Студент деректері",
    ru: "Данные студента",
    en: "Student Details",
  },
  university: {
    kk: "Университет",
    ru: "Университет",
    en: "University",
  },
  major: {
    kk: "Мамандық",
    ru: "Специальность",
    en: "Major",
  },
  studyStyle: {
    kk: "Оқу стилі",
    ru: "Стиль учёбы",
    en: "Study style",
  },
  interfaceLang: {
    kk: "Интерфейс тілі",
    ru: "Язык интерфейса",
    en: "Interface Language",
  },
  authSection: {
    kk: "Авторизация және рөлдер",
    ru: "Авторизация и роли",
    en: "Authentication & Roles",
  },
  loginBtn: {
    kk: "Кіру",
    ru: "Войти",
    en: "Log in",
  },
  logoutBtn: {
    kk: "Шығу",
    ru: "Выйти",
    en: "Log out",
  },
  loggedInAs: {
    kk: "Жүйеге кірген:",
    ru: "Вы вошли как:",
    en: "Logged in as:",
  },
  switchAccount: {
    kk: "Рөлді жылдам ауыстыру (Демо)",
    ru: "Быстрое переключение роли (Демо)",
    en: "Quick Role Switch (Demo)",
  },
  adminPanelBtn: {
    kk: "Әкімші тақтасы (Басқару)",
    ru: "Админ-панель (Управление)",
    en: "Admin Control Panel",
  },

  // Admin Panel
  adminHeading: {
    kk: "Әкімші тақтасы — Деректерді басқару",
    ru: "Панель администратора — Управление БД",
    en: "Admin Panel — Database Management",
  },
  addNewSpotBtn: {
    kk: "+ Жаңа орын қосу",
    ru: "+ Добавить новое место",
    en: "+ Add New Spot",
  },
  spotNameLabel: {
    kk: "Орынның атауы",
    ru: "Название пространства",
    en: "Spot Name",
  },
  spotAddressLabel: {
    kk: "Мекенжайы (Астана)",
    ru: "Адрес в Астане",
    en: "Address in Astana",
  },
  spotCategoryLabel: {
    kk: "Категория",
    ru: "Категория",
    en: "Category",
  },
  hoursLabel: {
    kk: "Жұмыс уақыты",
    ru: "Часы работы",
    en: "Working Hours",
  },
  createSuccess: {
    kk: "Жаңа орын дерекқорға қосылды!",
    ru: "Новое место успешно сохранено в БД!",
    en: "New spot saved to database!",
  },
  deleteSpotConfirm: {
    kk: "Бұл орынды дерекқордан жою керек пе?",
    ru: "Удалить это место из базы данных?",
    en: "Delete this spot from database?",
  },
  deleteBtn: {
    kk: "Жою",
    ru: "Удалить",
    en: "Delete",
  },
  cancelBtn: {
    kk: "Бас тарту",
    ru: "Отмена",
    en: "Cancel",
  },
};

const LANG_KEY = "spotfinder_lang";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "ru";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "kk" || saved === "ru" || saved === "en") return saved;
  } catch {}
  return "ru";
}

export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new Event("language-changed"));
}

export function useTranslation(lang: Language) {
  return function t(key: keyof typeof translations): string {
    const item = translations[key];
    if (!item) return key;
    return item[lang] || item["ru"] || key;
  };
}
