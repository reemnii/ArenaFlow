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
    image:
      "https://niuhuskies.com/images/2025/9/10/Kylie_Schulze.jpg",
    primaryLabel: "See Events",
    primaryLink: "/tournaments",
    secondaryLabel: "Learn More",
    secondaryLink: "/about",
  },
];

//quick navigation cards
const quickActions = [
  {
    title: "Upcoming Tournaments",
    description:
      "Browse active and upcoming competitions with dates, formats, and event status.",
    icon: Trophy,
    href: "/tournaments",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqUyPSttEGILWel5wyJG-xqPGm4y8TUuGMqg&s",
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
      "https://ca-times.brightspotcdn.com/dims4/default/12d7c58/2147483647/strip/true/crop/6282x4190+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F6d%2Fea%2Feb48830646eea9ce1377708bad75%2Fncaa-long-beach-st-ucla-volleyball-39266.jpg  ",
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

//supported volleybal formats
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

//testimonial cards show in community feedback
const feedback = [
  {
    quote:
      "ArenaFlow made registrations, schedules, and tournament communication much easier for our organizing team.",
    name: "Sarah Johnson",
    role: "Tournament Director",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW2MAFrFnfa_bT1jSttLbmvfotJcqQyCCGg&s",
  },
  {
    quote:
      "Our club had a clearer view of match times, venue updates, and team progress throughout the event.",
    name: "Michael Rivera",
    role: "Club Coordinator",
    image: "data:image/jpeg;base64,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",
  },
  {
    quote:
      "The platform felt simple to use and much more organized than our older tournament workflow.",
    name: "Emily Carter",
    role: "Operations Lead",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcyssMbcvEkMiCDu8zrO9VuN-Yy1aW1vycA&s",
  },
];

//FAQ accordation data
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

//fallback tournaments used if localstorage has no saved data
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

//hero section statistics
const stats = [
  { value: "35+", label: "Events" },
  { value: "120+", label: "Teams" },
  { value: "400+", label: "Matches" },
  { value: "4", label: "Formats" },
];

//formats tournament dates safely
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

//creates all the visible calender call for one month
function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];

  //fill previous month's ending days
  for (let i = startDay - 1; i >= 0; i -= 1) {
    cells.push({
      key: `prev-${i}`,
      day: prevMonthDays - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }

  //fill current month's days
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `current-${day}`,
      day,
      currentMonth: true,
      date: new Date(year, month, day),
    });
  }

  //fill next month's starting days so the grid stays compelte
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
// reusable card style
const glassCard =
  "rounded-[1.6rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(18,10,35,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]";
// primary filled button style
const filledBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/12 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/18 hover:shadow-[0_8px_26px_rgba(0,0,0,0.18)]";
// secondary outline button style
const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 dark:border-white/10 border-[#6B124B]/20 bg-white/55 dark:bg-white/6 px-5 py-3 text-sm font-bold text-slate-800 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/12 hover:border-white/30 dark:hover:border-white/20";
export default function Home() {
  // current hero slide 
  const [activeSlide, setActiveSlide] = useState(0);
  // tournaments shown in cards/calendar
  const [featuredTournaments, setFeaturedTournaments] =
    useState(fallbackTournaments);
    // open FAQ index
  const [openFaq, setOpenFaq] = useState(0);
  // current visible month in calendar
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 3, 1));
  // selected event shown under the calendar
  const [selectedTournament, setSelectedTournament] = useState(null);

  // load tournaments from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("tournaments");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // normalize saved data so all cards have the same shape
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
   // auto-slide hero every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // current hero object
  const currentSlide = useMemo(() => heroSlides[activeSlide], [activeSlide]);
  // go to next hero slide
  const goNext = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  // go to previous hero slide
  const goPrev = () =>
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // current calendar year/month
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  // label shown above calendar
  const monthLabel = calendarDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // generated calendar cells
  const calendarDays = useMemo(
    () => buildCalendarDays(year, month),
    [year, month]
  );
  // group tournaments by day for the calendar
  const eventsByDay = useMemo(() => {
    const map = new Map();

    featuredTournaments.forEach((event) => {
      const date = new Date(event.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    });

    return map;
  }, [featuredTournaments]);

  return (
    <div classname="relative overflow-x hidden">
      {/* page glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-8 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[18%] h-72 w-72 rounded-full bg-brand-dark/20 blur-3xl" />
        <div className="absolute bottom-[12%] left-[18%] h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      </div>

      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              className={`${glassCard} relative flex h-[420px] flex-col justify-center overflow-hidden p-5 sm:h-[460px] sm:p-7 lg:h-[500px] lg:p-8`}
            >
              {/* soft shine */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)]" />

              {/* small title above hero heading */}
              <motion.p
                key={currentSlide.eyebrow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300 sm:text-xs"
              >
                {currentSlide.eyebrow}
                
              </motion.p>

              {/* animated hero content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="relative"
                >
                  <h1 className="max-w-3xl text-3xl font-black leading-[1.02] sm:text-4xl lg:text-5xl">
                    {currentSlide.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-white/72 sm:text-base">
                    {currentSlide.description}
                  </p>

                  {/* hero buttons */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                  {/* stats cards */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/20 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20"
                      >
                        <p className="text-xl font-black sm:text-2xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {/* right side hero image */}
          <div className="lg:col-span-5">
            <div
              className={`${glassCard} relative h-[420px] overflow-hidden sm:h-[460px] lg:h-[500px]`}
            >
              {/* animated hero image */}
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

              {/* branded overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1d2360]/70 via-[#6f2380]/45 to-[#b0185e]/65" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_30%,transparent_70%,rgba(255,255,255,0.06))]" />

              {/* slider controls */}
              <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
                <div className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md sm:text-[11px]">
                  Featured Event
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    aria-label="Previous slide"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition hover:bg-white/10"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next slide"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition hover:bg-white/10"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              {/* bottom image text box */}
              <div className="absolute bottom-3 left-3 right-3 rounded-[1.3rem] border border-white/15 bg-black/20 p-4 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-fuchsia-200">
                  Volleyball Tournament Management
                </p>
                <p className="mt-2 text-sm leading-6 text-white/90">
                  Registrations, schedules, teams, venues, and live competition
                  information in one smoother experience.
                </p>
              </div>
            </div>
            {/* hero dots */}

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

      {/* quick actions */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                  className="group relative block h-[300px] overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_18px_45px_rgba(18,10,35,0.12)] transition-transform duration-300 hover:-translate-y-1 dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#341248]/20 via-[#4d1e61]/40 to-[#1b1025]/88" />

                  {/* top icon */}
                  <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/12 p-3 text-white backdrop-blur-md">
                    <Icon size={20} />
                  </div>

                  {/* simple hover card */}
                  <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/15 bg-white/15 p-4 transition-all duration-300 group-hover:bg-white/18 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] dark:bg-white/10">
                    <h3 className="text-xl font-black text-white">{item.title}</h3>
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

      {/* competition formats */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className={`${glassCard} p-5 sm:p-6 lg:p-8`}>
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
                  className="overflow-hidden rounded-[1.35rem] border border-white/20 bg-white/55 dark:border-white/10 dark:bg-black/20"
                >
                  <div className="relative h-44">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1025]/90 via-[#4d1e61]/50 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/12 p-3 text-white backdrop-blur-md">
                      <Icon size={18} />
                    </div>
                    <h3 className="absolute bottom-4 left-4 right-4 text-lg font-black text-white">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-7 text-slate-600 dark:text-white/68">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* tournaments and calendar section */}
      <section className="mx-auto max-w-7xl max-h-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* left tournament cards */} 
          <div className="lg:col-span-7">
            <div className={`${glassCard} h-full p-5 sm:p-6`}>
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
                    className="flex min-h-[220px] flex-col justify-between rounded-[1.35rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:bg-white/10 dark:text-fuchsia-200">
                          {tournament.status}
                        </span>

                        <div className="rounded-2xl bg-white/75 p-2.5 text-brand dark:bg-white/10 dark:text-fuchsia-200">
                          <Volleyball size={17} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-black leading-tight">
                        {tournament.name}
                      </h3>

                      <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/68">
                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={15}
                            className="text-brand dark:text-fuchsia-300"
                          />
                          <span>{formatDate(tournament.date)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin
                            size={15}
                            className="text-brand dark:text-fuchsia-300"
                          />
                          <span>{tournament.location}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users
                            size={15}
                            className="text-brand dark:text-fuchsia-300"
                          />
                          <span>{tournament.teams} Teams</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/8 dark:text-white/70">
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
          {/* right calendar */}
          <div className="lg:col-span-5">
            <div className={`${glassCard} h-full p-5 sm:p-6`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
                    Tournament Calendar
                  </p>
                  <h2 className="mt-1 text-xl font-black">{monthLabel}</h2>
                </div>
                {/* change month buttons */}
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/8"
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/8"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
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
                      className={`relative min-h-[62px] rounded-2xl p-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border border-[#f0b4df] bg-white/18 ring-2 ring-[#f0b4df] dark:bg-white/10"
                          : "border border-transparent bg-transparent hover:bg-white/8 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          cell.currentMonth
                            ? "text-slate-800 dark:text-white"
                            : "text-slate-400 dark:text-white/30"
                        }`}
                      >
                        {cell.day}
                      </span>
                      {/* show event dot if there is a tournament on that day */}
                      {events.length > 0 && (
                        <div className="mt-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand dark:bg-fuchsia-300" />
                           {/* show selected event name inside the selected cell */}
                          {isSelected && (
                            <p className="mt-1 line-clamp-2 text-[10px] font-semibold leading-4 text-slate-700 dark:text-white/78">
                              {events[0].name}
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* selected event details */}
              {selectedTournament && (
                <div className="mt-4 rounded-[1.25rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand dark:text-fuchsia-300">
                        Selected Event
                      </p>
                      <h3 className="mt-2 text-lg font-black">
                        {selectedTournament.name}
                      </h3>
                    </div>

                    <CalendarDays
                      size={18}
                      className="text-brand dark:text-fuchsia-300"
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-white/68">
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={15}
                        className="text-brand dark:text-fuchsia-300"
                      />
                      <span>{formatDate(selectedTournament.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-brand dark:text-fuchsia-300"
                      />
                      <span>{selectedTournament.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users
                        size={15}
                        className="text-brand dark:text-fuchsia-300"
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

      {/* feedback */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className={`${glassCard} p-5 sm:p-6 lg:p-8`}>
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
                className={`flex min-h-[220px] flex-col justify-between rounded-[1.45rem] border p-5 sm:p-6 ${
                  index === 1
                    ? "border border-white/20 bg-white/10 backdrop-blur-xl text-inherit shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                    : "border-white/20 bg-white/60 dark:border-white/10 dark:bg-black/20"
                }`}
              >
                <div>
                  {/* opening quote mark */}
                  <div
                    className={`mb-4 text-4xl leading-none ${
                      index === 1
                        ? "text-white/80"
                        : "text-brand dark:text-fuchsia-300"
                    }`}
                  >
                    “
                  </div>
                   {/* feedback text */}
                  <p
                    className={`text-base leading-8 ${
                      index === 1
                        ? "text-white/95"
                        : "text-slate-700 dark:text-white/74"
                    }`}
                  >
                    {item.quote}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/15 pt-4 dark:border-white/10 flex items-center gap-3">
  
                  {/* profile image from link */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover border border-white/20"
                  />

                  {/* name + role */}
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

      {/* about us */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* about text */}
          <div className="lg:col-span-7">
            <div className={`${glassCard} h-full p-5 sm:p-6 lg:p-8`}>
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

          {/* core focus cards */}
          <div className="lg:col-span-5">
            <div className={`${glassCard} h-full p-5 sm:p-6`}>
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
                    className="rounded-[1.2rem] border border-white/20 bg-white/55 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/72"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-6 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className={`${glassCard} p-5 sm:p-6 lg:p-8`}>
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
              FAQs
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Common questions
            </h2>
          </div>

          {/* accordion items */}
          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[1.25rem] border border-white/20 bg-white/55 dark:border-white/10 dark:bg-black/20"
                >
                  {/* question button */}
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-label={item.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span className="font-bold">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* animated answer */}
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