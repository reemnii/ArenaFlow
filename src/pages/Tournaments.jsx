import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Volleyball } from "lucide-react";
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
  //search input state
  const [searchTerm, setSearchTerm] = useState("");
  //filter by tournament status
  const [statusFilter, setStatusFilter] = useState("All");
  //stores tournaments from localStorage
  const [storedTournaments, setStoredTournaments] = useState([]);
  //detect light/dark mode 
  const [isLight, setIsLight] = useState(
    document.documentElement.classList.contains("light")
  );
  
  //load stored tournaments from localstorage on mount
  useEffect(() => {
    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];
    setStoredTournaments(savedTournaments);
  }, []);
  
  //observe theme changes dynamically
  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsLight(root.classList.contains("light"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  //combine default tournaments with stored ones
  const allTournaments = useMemo(() => {
    return [...tournaments, ...storedTournaments];
  }, [storedTournaments]);

  //filter tournaments based on search and status
  const filteredTournaments = useMemo(() => {
    return allTournaments.filter((tournament) => {
      const matchesSearch =
        (tournament.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (tournament.location || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (tournament.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (tournament.type || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (tournament.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allTournaments]);

  //return styling classes for status badge
  const getStatusClasses = (status) => {
    const normalizedStatus = (status || "").toLowerCase();

    switch (normalizedStatus) {
      case "live":
      case "ongoing":
        return "bg-red-500/15 text-red-300 border border-red-400/30";
      case "upcoming":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30";
      case "completed":
        return "bg-slate-500/20 text-slate-300 border border-slate-400/30";
      default:
        return "bg-white/10 text-white border border-white/20";
    }
  };

  return (
    <section className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
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
                Browse volleyball tournaments and explore event details.
              </p>
            </div>

            {/* Button to create new tournament */}
            <Link
              to="/create"
              className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.03] ${
                isLight
                  ? "bg-[#ffffff10] text-[#3d0d33] border border-white/20 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:bg-[#ffffff20]"
                  : "bg-brand text-white hover:bg-brand/90 shadow-[0_8px_30px_rgba(145,48,117,0.4)]"
              }`}
              >
           Create Tournament
          </Link>
          </div>
        </div>

        {/* Search and filter controls */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-inherit/50"
              />
              <input
                type="text"
                placeholder="Search by name, location, description, or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search tournaments"
                className={`w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 outline-none${
                  isLight
                    ? "text-[#913075]/70 placeholder:text-[#913075]/40"
                    : "text-grey-300 placeholder:text-grey-400"
                }`}
              />
            </div>

            {/* Status filter dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter tournaments by status"
              className={`min-w-[180px] rounded-xl px-4 py-3 outline-none transition-all cursor-pointer ${
                isLight
                  ? "bg-[#ffffff10] text-[#3d0d33] border border-white/20 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:bg-[#ffffff20]"
      : "bg-brand text-white hover:bg-brand/90 shadow-[0_8px_30px_rgba(145,48,117,0.4)]"
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredTournaments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-2xl font-bold">No tournaments found</h3>
            <p className="text-inherit/65">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* Tournament cards grid */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Image and status badge */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={
                      tournament.image ||
                      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={tournament.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Tournament status */}
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </div>

                <div className="p-5">
                  {/* Tournament name */}
                  <h2 className="mb-2 text-xl font-bold">{tournament.name}</h2>

                  {/* Description */}
                  <p className="mb-4 text-sm text-inherit/70">
                    {tournament.description || "No description available"}
                  </p>

                  {/* Volleyball type */} 
                  <div className="flex items-center gap-2">
                    <Volleyball size={16} />
                    <span className="font-medium">{tournament.type || "Indoor"}</span>
                  </div>

                  {/* Tournament details */}
                  <div className="mb-4 space-y-2 text-sm text-inherit/75">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {tournament.date}
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

                  {/* Navigate to tournament details */}
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