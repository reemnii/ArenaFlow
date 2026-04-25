import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Trophy,
  UserCircle2,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  apiFetch,
  normalizeMatch,
  normalizeTeam,
  normalizeTournament,
} from "../utils/api";
import { getCurrentUser, getStoredAuth } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = getCurrentUser();
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getStoredAuth().isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    async function loadData() {
      try {
        const [teamsData, tournamentsData, matchesData] = await Promise.all([
          apiFetch("/api/teams"),
          apiFetch("/api/tournaments"),
          apiFetch("/api/matches"),
        ]);

        setTeams((teamsData || []).map(normalizeTeam));
        setTournaments((tournamentsData || []).map(normalizeTournament));
        setMatches((matchesData || []).map(normalizeMatch));
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      }
    }

    loadData();
  }, [navigate]);

  const performanceData = useMemo(() => {
    const winsMap = new Map();

    matches.forEach((match) => {
      if (!match.winner) return;
      winsMap.set(match.winner, (winsMap.get(match.winner) || 0) + 1);
    });

    return Array.from(winsMap.entries())
      .map(([teamId, wins]) => ({
        name: teams.find((team) => String(team.id) === String(teamId))?.name || "Unknown",
        wins,
      }))
      .sort((left, right) => right.wins - left.wins)
      .slice(0, 4);
  }, [matches, teams]);

  const upcomingTournaments = useMemo(() => {
    return tournaments
      .filter((tournament) => String(tournament.status).toLowerCase() === "upcoming")
      .sort((left, right) => new Date(left.startDate || left.date) - new Date(right.startDate || right.date))
      .slice(0, 3);
  }, [tournaments]);

  const tournamentStatusData = [
    {
      name: "Upcoming",
      value: tournaments.filter((item) => item.status === "upcoming").length,
      color: "#913075",
    },
    {
      name: "Ongoing",
      value: tournaments.filter((item) => item.status === "ongoing").length,
      color: "#b14d93",
    },
    {
      name: "Completed",
      value: tournaments.filter((item) => item.status === "completed").length,
      color: "#47004A",
    },
  ];

  const stats = [
    {
      title: "Total Tournaments",
      value: tournaments.length,
      icon: Trophy,
      subtitle: "Live tournament records",
    },
    {
      title: "Registered Teams",
      value: teams.length,
      icon: Users,
      subtitle: "Loaded from backend",
    },
    {
      title: "Scheduled Matches",
      value: matches.length,
      icon: ShieldCheck,
      subtitle: "Current match records",
    },
  ];

  const smoothDrop = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const smoothStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const tooltipStyle = {
    backgroundColor: "rgba(25, 15, 35, 0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    color: "#fff",
  };

  if (!storedUser) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-10 text-inherit sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <motion.section
          variants={smoothDrop}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px] sm:p-8 lg:p-10"
        >
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand/20 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-brand-deep/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-inherit/60">
                ArenaFlow Dashboard
              </p>
              <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl">
                Welcome back, <span>{storedUser.username}</span>
              </h1>
              <p className="text-sm leading-7 text-inherit/75 sm:text-base">
                Tournament, team, and match totals are now coming from the live backend.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 text-[#dab1da] dark:text-white lg:max-w-md">
              <Link
                to="/create"
                className="group block h-full rounded-2xl border border-white/10 bg-brand/80 p-4 shadow-lg transition-all hover:bg-brand sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <PlusCircle size={22} />
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-sm font-semibold sm:text-lg">Create Tournament</h3>
              </Link>

              <Link
                to="/participants"
                className="group block h-full rounded-2xl border border-white/10 bg-white/10 p-4 text-inherit shadow-lg transition-all hover:bg-white/15 sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <ClipboardList size={22} />
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-sm font-semibold sm:text-lg">Manage Teams</h3>
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={smoothStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5"
        >
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={smoothDrop}
                className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-xs text-inherit/60 sm:mb-2 sm:text-sm">{item.title}</p>
                    <h2 className="text-2xl font-bold sm:text-3xl">{item.value}</h2>
                    <p className="mt-1 text-xs text-inherit/70 sm:mt-2 sm:text-sm">{item.subtitle}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-brand/20 sm:h-12 sm:w-12">
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section
          variants={smoothStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-2"
        >
          <motion.div variants={smoothDrop} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Team Performance</h2>
              <p className="mt-1 text-sm text-inherit/65">Wins overview for top teams</p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "currentColor", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="wins" radius={[10, 10, 0, 0]} fill="#913075" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={smoothDrop} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Tournament Status</h2>
              <p className="mt-1 text-sm text-inherit/65">Distribution of current tournament phases</p>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
              <div className="h-52 sm:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tournamentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      {tournamentStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {tournamentStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <div className="flex-1">
                      <p className="text-sm text-inherit/75">{item.name}</p>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          variants={smoothStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-3"
        >
          <motion.div variants={smoothDrop} className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Upcoming Tournaments</h2>
                <p className="mt-1 text-sm text-inherit/65">Quick overview of upcoming events</p>
              </div>
              <Link to="/tournaments" className="text-sm text-inherit transition hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {upcomingTournaments.length > 0 ? (
                upcomingTournaments.map((tournament) => (
                  <div key={tournament.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{tournament.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-inherit/70">
                          <span className="flex items-center gap-2">
                            <MapPin size={16} />
                            {tournament.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {tournament.startDate
                              ? new Date(tournament.startDate).toLocaleDateString()
                              : "TBA"}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/tournaments/${tournament.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand/90"
                      >
                        Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/65">
                  No upcoming tournaments available.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={smoothDrop} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-brand/20">
                <UserCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Profile Summary</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm text-inherit/60">Username</p>
                <p className="font-medium">{storedUser.username}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm text-inherit/60">Email</p>
                <p className="break-all font-medium">{storedUser.email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm text-inherit/60">Role</p>
                <p className="capitalize font-medium">{storedUser.role}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-all hover:bg-brand/90"
              >
                <UserCircle2 size={16} />
                View Profile
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
