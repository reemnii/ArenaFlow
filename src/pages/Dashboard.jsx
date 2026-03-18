import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Trophy,
  Users,
  ShieldCheck,
  ArrowRight,
  MapPin,
  UserCircle2,
  PlusCircle,
  ClipboardList,
  Swords,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { tournaments } from "../data/tournaments";
import { teams } from "../data/teams";
import { users as defaultUsers } from "../data/users";
import { standings } from "../data/standings";

export default function Dashboard() {
  const navigate = useNavigate();
  let savedUsers = [];
  let storedUser=null;
  try {
    storedUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
    savedUsers = JSON.parse(localStorage.getItem("users")) || defaultUsers;
  } catch (error) {
    savedUsers = defaultUsers;
  }

  const safeUsers = Array.isArray(savedUsers) ? savedUsers : defaultUsers;
  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeTournaments = Array.isArray(tournaments) ? tournaments : [];
  const safeStandings = Array.isArray(standings) ? standings : [];

  useEffect(() => {
    if (!storedUser) {
      navigate("/login", { replace: true });
    }
  }, [storedUser, navigate]);

  if (!storedUser) {
    return null;
  }

  const fallbackUser = storedUser;

  const isAdmin = fallbackUser.role === "admin";
  const isOrganizer = fallbackUser.role === "organizer";
  const canManage = isAdmin || isOrganizer;

  const upcomingTournaments = safeTournaments
    .filter((tournament) => tournament.status?.toLowerCase() === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  const menTeams = safeTeams
    .filter((team) => team.gender === "male")
    .slice(0, 3);

  const womenTeams = safeTeams
    .filter((team) => team.gender === "female")
    .slice(0, 3);

  const stats = [
    {
      title: "Total Tournaments",
      value: safeTournaments.length,
      icon: Trophy,
      subtitle: "Active and upcoming events",
    },
    {
      title: "Registered Teams",
      value: safeTeams.length,
      icon: Users,
      subtitle: "Across all divisions",
    },
    {
      title: "Players / Users",
      value: safeUsers.length,
      icon: ShieldCheck,
      subtitle: "Registered accounts",
    },
  ];

  const performanceData = safeStandings
    .map((entry) => {
      const team = safeTeams.find((team) => team.id === entry.teamId);
      return {
        name: team ? team.name : "Unknown",
        wins: entry.wins,
      };
    })
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 4);

  const upcomingCount = safeTournaments.filter(
    (tournament) => tournament.status?.toLowerCase() === "upcoming"
  ).length;

  const ongoingCount = safeTournaments.filter(
    (tournament) => tournament.status?.toLowerCase() === "ongoing"
  ).length;

  const completedCount = safeTournaments.filter(
    (tournament) => tournament.status?.toLowerCase() === "completed"
  ).length;

  const tournamentStatusData = [
    { name: "Upcoming", value: upcomingCount, color: "#913075" },
    { name: "Ongoing", value: ongoingCount, color: "#b14d93" },
    { name: "Completed", value: completedCount, color: "#47004A" },
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

  function getStatusClasses(status) {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "upcoming") {
      return "bg-[#913075]/20 text-[#f3c8e8] border border-[#913075]/40";
    }

    if (normalizedStatus === "ongoing") {
      return "bg-[#b14d93]/20 text-[#ffd7f3] border border-[#b14d93]/40";
    }

    if (normalizedStatus === "completed") {
      return "bg-[#47004A]/30 text-[#e8c7e9] border border-[#47004A]/50";
    }

    return "bg-white/10 text-white/80 border border-white/10";
  }

  function getTeamName(id) {
    const team = safeTeams.find((team) => team.id === id);
    return team ? team.name : "Unknown Team";
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.section
          variants={smoothDrop}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-8 lg:p-10 overflow-hidden relative"
        >
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-brand/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-brand-deep/20 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-white/60 mb-3">
                ArenaFlow Dashboard
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
                Welcome back,{" "}
                <span className="text-[#e7b5db]">{fallbackUser.username}</span>
              </h1>

              <p className="text-white/75 text-sm sm:text-base leading-7">
                {canManage
                  ? "Manage tournaments, review registered teams, and control platform activity from one place."
                  : "View tournaments, check teams, and track your activity from one place."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="w-full sm:w-auto text-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm capitalize">
                  Role: {fallbackUser.role}
                </span>

                <span className="w-full sm:w-auto text-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm break-all">
                  {fallbackUser.email}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:max-w-md">
              {canManage ? (
                <Link
                  to="/create"
                  className="group block h-full bg-brand/80 hover:bg-brand transition-all rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <PlusCircle size={22} />
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg">
                    Create Tournament
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-2">
                    Add a new event to the platform.
                  </p>
                </Link>
              ) : (
                <Link
                  to="/tournaments"
                  className="group block h-full bg-brand/80 hover:bg-brand transition-all rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Trophy size={22} />
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg">
                    Browse Tournaments
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-2">
                    Explore available tournaments and event details.
                  </p>
                </Link>
              )}

              <Link
                to="/participants"
                className="group block h-full bg-white/10 hover:bg-white/15 transition-all rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <ClipboardList size={22} />
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg">
                  {canManage ? "Manage Teams" : "View Teams"}
                </h3>
                <p className="text-xs sm:text-sm text-white/75 mt-2">
                  {canManage
                    ? "View and organize participating teams."
                    : "See the participating teams and divisions."}
                </p>
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={smoothStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
        >
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={smoothDrop}
                className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">
                      {item.title}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold">{item.value}</h2>
                    <p className="text-xs sm:text-sm text-white/70 mt-1 sm:mt-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand/20 border border-white/10 flex items-center justify-center">
                    <Icon size={20} className="sm:w-5.5 sm:h-5.5" />
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
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <motion.div
            variants={smoothDrop}
            className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Team Performance</h2>
              <p className="text-sm text-white/65 mt-1">
                Wins overview for top teams
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#d9d9d9", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, "dataMax + 1"]}
                    tickCount={5}
                    tick={{ fill: "#d9d9d9", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="wins" radius={[10, 10, 0, 0]} fill="#913075" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={smoothDrop} className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Tournament Status</h2>
              <p className="text-sm text-white/65 mt-1">
                Distribution of current tournament phases
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
              <div className="h-52 sm:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tournamentStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
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
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <div className="flex-1">
                      <p className="text-sm text-white/75">{item.name}</p>
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
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          
          <motion.div
            variants={smoothDrop}
            className="xl:col-span-2 bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between gap-4 mb-6 ">
              <div>
                <h2 className="text-2xl font-bold">Upcoming Tournaments</h2>
                <p className="text-sm text-white/65 mt-1">
                  Quick overview of upcoming events
                </p>
              </div>

              <Link
                to="/tournaments"
                className="text-sm text-[#e7b5db] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
              {upcomingTournaments.length > 0 ? (
                upcomingTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{tournament.name}</h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusClasses(
                              tournament.status
                            )}`}
                          >
                            {tournament.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#e7b5db] font-medium mt-1 mb-2">
                          <span>{getTeamName(tournament.team1Id)}</span>
                          <Swords size={14} className="text-[#d78ac4]" />
                          <span>{getTeamName(tournament.team2Id)}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-white/70">
                          <span className="flex items-center gap-2">
                            <MapPin size={16} />
                            {tournament.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {tournament.date}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/tournaments/${tournament.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/80 hover:bg-brand transition-all text-sm font-medium w-fit"
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

          <motion.div
            variants={smoothDrop}
            className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-white/10 flex items-center justify-center">
                <UserCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Profile Summary</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-white/60 mb-1">Username</p>
                <p className="font-medium">{fallbackUser.username}</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-white/60 mb-1">Email</p>
                <p className="font-medium break-all">{fallbackUser.email}</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-white/60 mb-1">Role</p>
                <p className="font-medium capitalize">{fallbackUser.role}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand/80 hover:bg-brand transition-all text-sm font-medium"
              >
                <UserCircle2 size={16} />
                View Profile
              </Link>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          variants={smoothStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div
            variants={smoothDrop}
            className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Men’s Teams</h2>
              <Link
                to="/participants"
                className="text-sm text-[#e7b5db] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {menTeams.length > 0 ? (
                menTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <span>{team.name}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-brand/20 border border-white/10 text-white/80">
                      Male
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-white/65">
                  No men teams available.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={smoothDrop}
            className="bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Women’s Teams</h2>
              <Link
                to="/participants"
                className="text-sm text-[#e7b5db] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {womenTeams.length > 0 ? (
                womenTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <span>{team.name}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-brand/20 border border-white/10 text-white/80">
                      Female
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-white/65">
                  No women teams available.
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
