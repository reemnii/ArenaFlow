import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
  Waves,
  Snowflake,
  Accessibility,
  Volleyball,
  Building2,
  Clock3,
} from "lucide-react";

// short data for hero
const heroSlides = [
  {
    id: 1,
    eyebrow: "Official Tournament Platform",
    title: "Manage volleyball tournaments with one clear flow.",
    description:
      "ArenaFlow helps clubs, organizers, and players handle registrations, schedules, teams, venues, and match-day updates in one place.",
    image:
      "https://cdn.britannica.com/81/198481-050-10CED2D9/Gilberto-Godoy-Filho-ball-Brazil-Argentina-volleyball-2007.jpg",
    primaryLabel: "Explore Tournaments",
    primaryLink: "/tournaments",
    secondaryLabel: "Register Team",
    secondaryLink: "/register",
  },
  {
    id: 2,
    eyebrow: "Built For Real Competition",
    title: "From entry to final match, stay organized and in control.",
    description:
      "Create a better experience for teams and visitors with faster access to fixtures, details, participating teams, and live tournament information.",
    image:
      "https://images.sidearmdev.com/convert?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fbcuathletics.com%2Fimages%2F2025%2F9%2F14%2FRTG20250913_0924.jpg&type=webp",
    primaryLabel: "View Schedule",
    primaryLink: "/tournaments",
    secondaryLabel: "Contact Us",
    secondaryLink: "/contact",
  },
  {
    id: 3,
    eyebrow: "Multiple Volleyball Formats",
    title: "Support indoor, beach, sitting, and snow volleyball events.",
    description:
      "A modern home page and management flow for federations, clubs, and organizers running professional volleyball competitions.",
    image: "https://niuhuskies.com/images/2025/9/10/Kylie_Schulze.jpg",
    primaryLabel: "See Events",
    primaryLink: "/tournaments",
    secondaryLabel: "Learn More",
    secondaryLink: "/about",
  },
];

// quick navigation cards
const quickActions = [
  {
    title: "Upcoming Tournaments",
    description:
      "Browse active and upcoming competitions with dates, formats, and event status.",
    icon: Trophy,
    href: "/tournaments",
    image:
      "https://www.ncaa.com/_flysystem/public-s3/styles/small_16x9/public-s3/thumbnails/2021-05/hawaiithumb.jpg?h=c673cd1c&itok=kLdiQTOd",
  },
  {
    title: "Teams & Clubs",
    description:
      "Follow participating teams, club entries, and competition structure.",
    icon: Users,
    href: "/participants",
    image:
      "https://volleyballmag.com/wp-content/uploads/2024/08/Kathryn-Plummer-attacks-against-Poland-FIVB-photo.jpg",
  },
  {
    title: "Tournament Schedule",
    description:
      "Track fixtures, match times, venues, and tournament flow in one view.",
    icon: CalendarDays,
    href: "/tournaments",
    image:
      "https://ca-times.brightspotcdn.com/dims4/default/12d7c58/2147483647/strip/true/crop/6282x4190+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F6d%2Fea%2Feb48830646eea9ce1377708bad75%2Fncaa-long-beach-st-ucla-volleyball-39266.jpg",
  },
  {
    title: "Support & Contact",
    description:
      "Reach out for help, event questions, and platform support.",
    icon: ShieldCheck,
    href: "/contact",
    image:
      "https://www.offtheblockblog.com/wp-content/uploads/2021/07/Poland_2021.jpg",
  },
];

// supported volleyball formats
const volleyTypes = [
  {
    title: "Indoor Volleyball",
    text: "The classic competition format for leagues, clubs, and large indoor tournaments with structured fixtures and venue planning.",
    icon: Volleyball,
    image:
      "https://www.avca.org/wp-content/uploads/2024/11/11-19-24-DI-POW-Olivia-Babcock-banner.jpg",
  },
  {
    title: "Beach Volleyball",
    text: "Ideal for pairs events and outdoor competitions with a lighter setup and beach-focused scheduling.",
    icon: Waves,
    image:
      "https://volleyballmag.com/wp-content/uploads/2024/03/fgnjyzm94uikde4qz5p6-e1710165504329.jpg",
  },
  {
    title: "Sitting Volleyball",
    text: "Supports inclusive tournaments with clear team organization, accessible scheduling, and strong event visibility.",
    icon: Accessibility,
    image:
      "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2107987.jpg?c=original",
  },
  {
    title: "Snow Volleyball",
    text: "A seasonal format that still needs strong registration, event structure, and tournament management.",
    icon: Snowflake,
    image:
      "https://www.south-tirol.com/media/qwjknpbq/snow-volleyball-kronplatz.jpg?rxy=0.5316073354908306,0.4609715104068203&width=1200&height=630&rnd=133559268910070000",
  },
];

// testimonial cards
const feedback = [
  {
    quote:
      "ArenaFlow made registrations, schedules, and tournament communication much easier for our organizing team.",
    name: "Sarah Johnson",
    role: "Tournament Director",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW2MAFrFnfa_bT1jSttLbmvfotJcqQyCCGg&s",
  },
  {
    quote:
      "Our club had a clearer view of match times, venue updates, and team progress throughout the event.",
    name: "Michael Rivera",
    role: "Club Coordinator",
    image:
      "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
  },
  {
    quote:
      "The platform felt simple to use and much more organized than our older tournament workflow.",
    name: "Emily Carter",
    role: "Operations Lead",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcyssMbcvEkMiCDu8zrO9VuN-Yy1aW1vycA&s",
  },
];

// FAQ data
const faqs = [
  {
    q: "Can teams register directly through the platform?",
    a: "Yes. Teams can register for available tournaments and review their event information in a clearer flow.",
  },
  {
    q: "Does ArenaFlow support multiple volleyball formats?",
    a: "Yes. The platform can present and organize indoor, beach, sitting, and snow volleyball events.",
  },
  {
    q: "Can visitors view tournament schedules and details?",
    a: "Yes. Schedules, venues, event status, and participating teams can be shown through the public tournament pages.",
  },
  {
    q: "Can organizers update tournament information later?",
    a: "Yes. Organizers can maintain event information, match schedules, and details as the competition progresses.",
  },
];

// fallback tournaments
const fallbackTournaments = [
  {
    id: 1,
    name: "National Spring Volleyball Cup",
    location: "Cairo Sports Hall",
    date: "2026-04-12",
    teams: 16,
    status: "Registration Open",
    level: "Senior Division",
    type: "Indoor",
  },
  {
    id: 2,
    name: "Coastal Beach Open",
    location: "Alexandria Beach Arena",
    date: "2026-04-18",
    teams: 12,
    status: "Upcoming",
    level: "Beach Doubles",
    type: "Beach",
  },
  {
    id: 3,
    name: "Unity Sitting Championship",
    location: "Giza Indoor Complex",
    date: "2026-04-23",
    teams: 10,
    status: "Upcoming",
    level: "Sitting Volleyball",
    type: "Sitting",
  },
  {
    id: 4,
    name: "Mountain Snow Challenge",
    location: "St. Catherine Winter Court",
    date: "2026-04-27",
    teams: 8,
    status: "Planned",
    level: "Snow Volleyball",
    type: "Snow",
  },
];

// hero stats
const stats = [
  { value: "35+", label: "Events" },
  { value: "120+", label: "Teams" },
  { value: "400+", label: "Matches" },
  { value: "4", label: "Formats" },
];

function formatDate(dateValue) {
  if (!dateValue) return "Date TBA";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    cells.push({
      key: `prev-${i}`,
      day: prevMonthDays - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `current-${day}`,
      day,
      currentMonth: true,
      date: new Date(year, month, day),
    });
  }

  const remainder = cells.length % 7;
  const trailing = remainder === 0 ? 0 : 7 - remainder;

  for (let i = 1; i <= trailing; i += 1) {
    cells.push({
      key: `next-${i}`,
      day: i,
      currentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  return cells;
}

const glassCard =
  "rounded-[1.4rem] sm:rounded-[1.6rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(18,10,35,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]";

const outlineBtn =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#6B124B]/20 dark:border-white/10 bg-white/55 dark:bg-white/6 px-5 py-3 text-sm font-bold text-slate-800 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/12 hover:border-white/30 dark:hover:border-white/20";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredTournaments, setFeaturedTournaments] =
    useState(fallbackTournaments);
  const [openFaq, setOpenFaq] = useState(0);
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 3, 1));
  const [selectedTournament, setSelectedTournament] = useState(
    fallbackTournaments[0]
  );

  useEffect(() => {
    const saved = localStorage.getItem("tournaments");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map((item, index) => ({
          id: item.id || index + 1,
          name: item.name || "Untitled Tournament",
          location: item.location || item.city || "Location TBA",
          date: item.date || "2026-04-12",
          teams:
            item.teamsCount ||
            item.numberOfTeams ||
            item.teams?.length ||
            item.teams ||
            0,
          status: item.status || "Upcoming",
          level: item.level || "Open Division",
          type: item.type || "Indoor",
        }));

        setFeaturedTournaments(normalized);
        setSelectedTournament(normalized[0]);
      }
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  const goNext = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const goPrev = () =>
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const monthLabel = calendarDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map();

    featuredTournaments.forEach((event) => {
      const date = new Date(event.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    });

    return map;
  }, [featuredTournaments]);

  return (
    <div className="relative overflow-x-hidden">
      <section className="mx-auto max-w-7xl px-3 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              className={`${glassCard} relative flex min-h-[360px] flex-col justify-center overflow-hidden p-4 sm:min-h-[440px] sm:p-7 lg:min-h-[500px] lg:p-8`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)]" />

              <motion.p
                key={currentSlide.eyebrow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand dark:text-fuchsia-300 sm:text-xs"
              >
                {currentSlide.eyebrow}
              </motion.p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="relative"
                >
                  <h1 className="max-w-3xl text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    {currentSlide.title}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 dark:text-white/72 sm:mt-4 sm:text-base sm:leading-7">
                    {currentSlide.description}
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
                    <Link
                      to={currentSlide.primaryLink}
                      className={outlineBtn}
                      aria-label={currentSlide.primaryLabel}
                    >
                      {currentSlide.primaryLabel}
                      <ArrowRight size={16} />
                    </Link>

                    <Link
                      to={currentSlide.secondaryLink}
                      className={outlineBtn}
                      aria-label={currentSlide.secondaryLabel}
                    >
                      {currentSlide.secondaryLabel}
                      <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/20 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20"
                      >
                        <p className="text-lg font-black sm:text-2xl">{stat.value}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-500 dark:text-white/50 sm:text-[10px]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`${glassCard} relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:min-h-[500px]`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-br from-[#1d2360]/70 via-[#6f2380]/45 to-[#b0185e]/65" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_30%,transparent_70%,rgba(255,255,255,0.06))]" />

              <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
                <div className="rounded-full border border-white/15 bg-black/20 px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md sm:px-3 sm:text-[11px]">
                  Featured Event
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    aria-label="Previous slide"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition hover:bg-white/10 sm:h-9 sm:w-9"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next slide"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition hover:bg-white/10 sm:h-9 sm:w-9"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 rounded-[1.1rem] border border-white/15 bg-black/20 p-3 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-[1.3rem] sm:p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-fuchsia-200 sm:text-[10px]">
                  Volleyball Tournament Management
                </p>
                <p className="mt-2 text-xs leading-5 text-white/90 sm:text-sm sm:leading-6">
                  Registrations, schedules, teams, venues, and live competition
                  information in one smoother experience.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition ${
                    activeSlide === index
                      ? "w-8 bg-brand dark:bg-fuchsia-300"
                      : "w-2.5 bg-slate-300 dark:bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
              Quick Access
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Move faster through the platform
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <Link
                  to={item.href}
                  aria-label={item.title}
                  className="group relative block h-[250px] overflow-hidden rounded-[1.4rem] border border-white/10 shadow-[0_18px_45px_rgba(18,10,35,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:h-[280px] lg:h-[300px] dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#341248]/20 via-[#4d1e61]/40 to-[#1b1025]/88" />

                  <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/12 p-3 text-white backdrop-blur-md">
                    <Icon size={20} />
                  </div>

                  <div className="absolute inset-x-3 bottom-3 rounded-[1.2rem] border border-white/15 bg-white/15 p-4 transition-all duration-300 group-hover:bg-white/18 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] dark:bg-white/10 sm:inset-x-4 sm:bottom-4 sm:rounded-[1.35rem]">
                    <h3 className="text-lg font-black text-white sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/88">
                      {item.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-100">
                      Open Section
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className={`${glassCard} p-4 sm:p-6 lg:p-8`}>
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
              Competition Formats
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Volleyball in every format
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {volleyTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-[1.2rem] border border-white/20 bg-white/55 dark:border-white/10 dark:bg-black/20 sm:rounded-[1.35rem]"
                >
                  <div className="relative h-40 sm:h-44">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1025]/90 via-[#4d1e61]/50 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/12 p-3 text-white backdrop-blur-md">
                      <Icon size={18} />
                    </div>
                    <h3 className="absolute bottom-4 left-4 right-4 text-base font-black text-white sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-6 sm:leading-7 text-slate-600 dark:text-white/68">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className={`${glassCard} h-full p-4 sm:p-6`}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
                    Featured Tournaments
                  </p>
                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Current competitions
                  </h2>
                </div>

                <Link
                  to="/tournaments"
                  className={outlineBtn}
                  aria-label="View all tournaments"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {featuredTournaments.slice(0, 4).map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex min-h-[200px] flex-col justify-between rounded-[1.2rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20 sm:min-h-[220px] sm:rounded-[1.35rem]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-700 dark:bg-white/10 dark:text-fuchsia-200 sm:text-[11px]">
                          {tournament.status}
                        </span>

                        <div className="rounded-2xl bg-white/75 p-2.5 text-brand dark:bg-white/10 dark:text-fuchsia-200">
                          <Volleyball size={17} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-black leading-tight sm:text-lg">
                        {tournament.name}
                      </h3>

                      <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/68">
                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={15}
                            className="text-brand dark:text-fuchsia-300 shrink-0"
                          />
                          <span>{formatDate(tournament.date)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin
                            size={15}
                            className="text-brand dark:text-fuchsia-300 shrink-0"
                          />
                          <span>{tournament.location}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users
                            size={15}
                            className="text-brand dark:text-fuchsia-300 shrink-0"
                          />
                          <span>{tournament.teams} Teams</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/8 dark:text-white/70">
                        {tournament.level}
                      </span>

                      <Link
                        to={`/tournaments/${tournament.id}`}
                        aria-label={`View details for ${tournament.name}`}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-all duration-300 hover:text-[#913075] dark:text-fuchsia-300 dark:hover:text-fuchsia-200"
                      >
                        Details
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={`${glassCard} h-full p-4 sm:p-6`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
                    Tournament Calendar
                  </p>
                  <h2 className="mt-1 text-lg font-black sm:text-xl">{monthLabel}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                    aria-label="Previous month"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/8 sm:h-9 sm:w-9"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                    aria-label="Next month"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/8 sm:h-9 sm:w-9"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[320px]">
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-white/50 sm:text-[11px]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {calendarDays.map((cell) => {
                      const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
                      const events = eventsByDay.get(key) || [];
                      const isSelected =
                        selectedTournament &&
                        new Date(selectedTournament.date).toDateString() ===
                          cell.date.toDateString();

                      return (
                        <button
                          key={cell.key}
                          type="button"
                          aria-label={`${
                            events.length > 0 ? `${events[0].name} on ` : ""
                          }${cell.date.toDateString()}`}
                          onClick={() => {
                            if (events.length > 0) {
                              setSelectedTournament(events[0]);
                            } else {
                              setSelectedTournament(null);
                            }
                          }}
                          className={`relative min-h-[54px] rounded-xl p-1.5 text-left transition-all duration-200 sm:min-h-[62px] sm:rounded-2xl sm:p-2 ${
                            isSelected
                              ? "border border-[#f0b4df] bg-white/18 ring-2 ring-[#f0b4df] dark:bg-white/10"
                              : "border border-transparent bg-transparent hover:bg-white/8 dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className={`text-[11px] font-bold sm:text-xs ${
                              cell.currentMonth
                                ? "text-slate-800 dark:text-white"
                                : "text-slate-400 dark:text-white/30"
                            }`}
                          >
                            {cell.day}
                          </span>

                          {events.length > 0 && (
                            <div className="mt-1.5 sm:mt-2">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand dark:bg-fuchsia-300 sm:h-2.5 sm:w-2.5" />
                              {isSelected && (
                                <p className="mt-1 line-clamp-2 text-[9px] font-semibold leading-3.5 text-slate-700 dark:text-white/78 sm:text-[10px] sm:leading-4">
                                  {events[0].name}
                                </p>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedTournament && (
                <div className="mt-4 rounded-[1.1rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20 sm:rounded-[1.25rem]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand dark:text-fuchsia-300">
                        Selected Event
                      </p>
                      <h3 className="mt-2 text-base font-black sm:text-lg">
                        {selectedTournament.name}
                      </h3>
                    </div>

                    <CalendarDays
                      size={18}
                      className="text-brand dark:text-fuchsia-300 shrink-0"
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-white/68">
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={15}
                        className="text-brand dark:text-fuchsia-300 shrink-0"
                      />
                      <span>{formatDate(selectedTournament.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-brand dark:text-fuchsia-300 shrink-0"
                      />
                      <span>{selectedTournament.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users
                        size={15}
                        className="text-brand dark:text-fuchsia-300 shrink-0"
                      />
                      <span>{selectedTournament.teams} Teams</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/tournaments/${selectedTournament.id}`}
                      className={outlineBtn}
                      aria-label={`Show more about ${selectedTournament.name}`}
                    >
                      Show More
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className={`${glassCard} p-4 sm:p-6 lg:p-8`}>
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
              Community Feedback
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              What organizers and clubs say
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {feedback.map((item, index) => (
              <div
                key={item.name}
                className={`flex min-h-[210px] flex-col justify-between rounded-[1.25rem] border p-4 sm:min-h-[220px] sm:rounded-[1.45rem] sm:p-6 ${
                  index === 1
                    ? "border border-white/20 bg-white/10 backdrop-blur-xl text-inherit shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                    : "border-white/20 bg-white/60 dark:border-white/10 dark:bg-black/20"
                }`}
              >
                <div>
                  <div
                    className={`mb-4 text-4xl leading-none ${
                      index === 1
                        ? "text-white/80"
                        : "text-brand dark:text-fuchsia-300"
                    }`}
                  >
                    “
                  </div>

                  <p
                    className={`text-sm leading-7 sm:text-base sm:leading-8 ${
                      index === 1
                        ? "text-white/95"
                        : "text-slate-700 dark:text-white/74"
                    }`}
                  >
                    {item.quote}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4 dark:border-white/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full border border-white/20 object-cover"
                  />

                  <div>
                    <p className="font-black">{item.name}</p>
                    <p
                      className={`text-sm ${
                        index === 1
                          ? "text-white/75"
                          : "text-slate-500 dark:text-white/55"
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className={`${glassCard} h-full p-4 sm:p-6 lg:p-8`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
                About Us
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Built for better volleyball event management
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
                ArenaFlow is designed to make volleyball tournament management
                clearer and more organized for organizers, clubs, teams, and
                participants. From event setup and registration to schedules and
                competition flow, the platform helps keep everything connected.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/about" className={outlineBtn} aria-label="Learn more about us">
                  Learn More
                  <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className={outlineBtn} aria-label="Get in touch">
                  Get In Touch
                  <Building2 size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={`${glassCard} h-full p-4 sm:p-6`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
                Core Focus
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Tournament creation and event setup",
                  "Team registration and participation tracking",
                  "Match scheduling and venue organization",
                  "Support for multiple volleyball formats",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1rem] border border-white/20 bg-white/55 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/72 sm:rounded-[1.2rem]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 pb-10 sm:px-6 sm:py-6 sm:pb-12 lg:px-8 lg:pb-16">
        <div className={`${glassCard} p-4 sm:p-6 lg:p-8`}>
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
              FAQs
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[1.1rem] border border-white/20 bg-white/55 dark:border-white/10 dark:bg-black/20 sm:rounded-[1.25rem]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-label={item.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span className="pr-2 text-sm font-bold sm:text-base">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 text-sm leading-7 text-slate-600 dark:px-5 dark:text-white/68">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}