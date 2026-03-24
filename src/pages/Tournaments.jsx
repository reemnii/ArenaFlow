import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarDays,
  MapPin,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { tournaments } from "../data/tournaments";

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [storedTournaments, setStoredTournaments] = useState([]);

  useEffect(() => {
    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];
    setStoredTournaments(savedTournaments);
  }, []);

  const allTournaments = useMemo(() => {
    return [...tournaments, ...storedTournaments];
  }, [storedTournaments]);

  const filteredTournaments = useMemo(() => {
    return allTournaments.filter((tournament) => {
      const matchesSearch =
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || tournament.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allTournaments]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Live":
        return "bg-red-500/15 text-red-300 border border-red-400/30";
      case "Upcoming":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30";
      case "Completed":
        return "bg-slate-500/20 text-slate-300 border border-slate-400/30";
      default:
        return "bg-white/10 text-white border border-white/20";
    }
  };

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 text-inherit">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-white/60">
                ArenaFlow
              </p>
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
                Explore Tournaments
              </h1>
              <p className="max-w-2xl text-inherit/70">
                Browse volleyball tournaments, explore event details, and follow
                the competition through one organized platform.
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold transition hover:bg-brand/90"
            >
              Create Tournament
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-inherit/50"
              />
              <input
                type="text"
                placeholder="Search by tournament name, season, location, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-inherit outline-none placeholder:text-inherit/45"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[180px] rounded-xl border border-white/10 bg-[#2b0f28] px-4 py-3 text-inherit outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredTournaments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <h3 className="mb-2 text-2xl font-bold">No tournaments found</h3>
            <p className="text-white/65">
              Try changing your search or selected status.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="mb-2 line-clamp-2 text-xl font-bold">
                    {tournament.name}
                  </h2>

                  <p className="mb-2 text-sm text-inherit/55">
                    {tournament.season}
                  </p>

                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-inherit/70">
                    {tournament.description}
                  </p>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3 text-inherit/75">
                      <CalendarDays size={17} />
                      <span className="text-sm">{tournament.date}</span>
                    </div>

                    <div className="flex items-center gap-3 text-inherit/75">
                      <MapPin size={17} />
                      <span className="text-sm">{tournament.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-inherit/75">
                      <Users size={17} />
                      <span className="text-sm">{tournament.maxTeams} Max teams</span>
                    </div>

                    <div className="flex items-center gap-3 text-inherit/75">
                      <Trophy size={17} />
                      <span className="text-sm">Prize: {tournament.prize}</span>
                    </div>
                  </div>

                  <Link
                    to={`/tournaments/${tournament.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold transition hover:bg-brand/90"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}