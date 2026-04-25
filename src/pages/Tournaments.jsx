import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Search,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";
import { apiFetch, normalizeTournament } from "../utils/api";

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLight, setIsLight] = useState(
    document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    async function loadTournaments() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiFetch("/api/tournaments");
        setTournaments((data || []).map(normalizeTournament));
      } catch (requestError) {
        setError(requestError.message || "Unable to load tournaments.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTournaments();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsLight(root.classList.contains("light"));
    const observer = new MutationObserver(updateTheme);

    updateTheme();
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const haystack = [
        tournament.name,
        tournament.location,
        tournament.description,
        tournament.type,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        String(tournament.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, tournaments]);

  function getStatusClasses(status) {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "ongoing" || normalizedStatus === "live") {
      return "border border-red-400/30 bg-red-500/15 text-red-300";
    }

    if (normalizedStatus === "upcoming" || normalizedStatus === "published") {
      return "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300";
    }

    if (normalizedStatus === "completed") {
      return "border border-slate-400/30 bg-slate-500/20 text-slate-300";
    }

    if (normalizedStatus === "draft") {
      return "border border-amber-400/30 bg-amber-500/15 text-amber-200";
    }

    return "border border-white/20 bg-white/10 text-white";
  }

  return (
    <section className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-inherit/60">
                ArenaFlow
              </p>
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
                Explore Tournaments
              </h1>
              <p className="max-w-2xl text-inherit/70">
                Browse live tournament records directly from the backend.
              </p>
            </div>

            <Link
              to="/create"
              className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.03] ${
                isLight
                  ? "border border-white/20 bg-[#ffffff10] text-[#3d0d33] shadow-[0_4px_15px_rgba(0,0,0,0.05)] backdrop-blur-md hover:bg-[#ffffff20]"
                  : "bg-brand text-white shadow-[0_8px_30px_rgba(145,48,117,0.4)] hover:bg-brand/90"
              }`}
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
                placeholder="Search by name, location, description, or type"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className={`w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 outline-none ${
                  isLight
                    ? "text-[#913075]/70 placeholder:text-[#913075]/40"
                    : "text-grey-300 placeholder:text-grey-400"
                }`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={`min-w-[180px] cursor-pointer rounded-xl px-4 py-3 outline-none transition-all ${
                isLight
                  ? "border border-white/20 bg-[#ffffff10] text-[#3d0d33] shadow-[0_4px_15px_rgba(0,0,0,0.05)] backdrop-blur-md hover:bg-[#ffffff20]"
                  : "bg-brand text-white shadow-[0_8px_30px_rgba(145,48,117,0.4)] hover:bg-brand/90"
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            Loading tournaments...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-10 text-center text-red-100">
            {error}
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-2xl font-bold">No tournaments found</h3>
            <p className="text-inherit/65">Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={
                      tournament.image ||
                      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={tournament.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="mb-2 text-xl font-bold">{tournament.name}</h2>
                  <p className="mb-4 text-sm text-inherit/70">
                    {tournament.description || "No description available"}
                  </p>

                  <div className="mb-4 flex items-center gap-2">
                    <Volleyball size={16} />
                    <span className="font-medium">
                      {tournament.type || tournament.volleyballType || "Indoor"}
                    </span>
                  </div>

                  <div className="mb-4 space-y-2 text-sm text-inherit/75">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {tournament.startDate
                        ? new Date(tournament.startDate).toLocaleDateString()
                        : "TBA"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {tournament.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {tournament.maxTeams || 0} teams
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={16} />
                      {tournament.prize || "No prize"}
                    </div>
                  </div>

                  <Link
                    to={`/tournaments/${tournament.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand/90"
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
