import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UserCircle2,
  ShieldCheck,
  Edit3,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  LogOut,
  Trophy,
  Users,
  CalendarDays,
  Swords,
} from "lucide-react";

import { teams as teamsData } from "../data/teams";
import { tournaments as tournamentsFileData } from "../data/tournaments";
import { matches as matchesFileData } from "../data/matches";

export default function AdminProfile({
  currentUser,
  allUsers,
  setCurrentUser,
  setAllUsers,
  onLogout,
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const smoothDrop = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const safeTeams = useMemo(() => {
    let storedTeams = [];
    try {
      storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    } catch {
      storedTeams = [];
    }

    const fileTeams = Array.isArray(teamsData) ? teamsData : [];
    return storedTeams.length > 0 ? storedTeams : fileTeams;
  }, []);

  const safeTournaments = useMemo(() => {
    let storedTournaments = [];
    try {
      storedTournaments =
        JSON.parse(localStorage.getItem("tournaments")) ||
        JSON.parse(localStorage.getItem("mockTournaments")) ||
        JSON.parse(localStorage.getItem("allTournaments")) ||
        [];
    } catch {
      storedTournaments = [];
    }

    const fileTournaments = Array.isArray(tournamentsFileData)
      ? tournamentsFileData
      : [];

    return storedTournaments.length > 0 ? storedTournaments : fileTournaments;
  }, []);

  const safeMatches = useMemo(() => {
    let storedMatches = [];
    try {
      storedMatches =
        JSON.parse(localStorage.getItem("matches")) ||
        JSON.parse(localStorage.getItem("allMatches")) ||
        [];
    } catch {
      storedMatches = [];
    }

    const fileMatches = Array.isArray(matchesFileData) ? matchesFileData : [];
    return storedMatches.length > 0 ? storedMatches : fileMatches;
  }, []);

  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter(
    (user) => user.role?.trim().toLowerCase() === "admin"
  ).length;
  const totalPlayers = allUsers.filter(
    (user) => user.role?.trim().toLowerCase() === "player"
  ).length;
  const totalCoaches = allUsers.filter(
    (user) => user.role?.trim().toLowerCase() === "coach"
  ).length;

  const totalTeams = safeTeams.length;
  const totalTournaments = safeTournaments.length;
  const totalMatches = safeMatches.length;

  const activeTournaments = safeTournaments.filter((tournament) =>
    ["active", "ongoing", "open", "in progress", "upcoming"].includes(
      tournament?.status?.trim().toLowerCase()
    )
  ).length;

  const recentUsers = allUsers.slice(0, 6);
  const recentTournaments = safeTournaments.slice(0, 4);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const trimmedUsername = profileForm.username.trim();
    const trimmedEmail = profileForm.email.trim();

    if (!trimmedUsername || !trimmedEmail) {
      setProfileError("Please fill in all profile fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    const usernameTaken = allUsers.some(
      (user) =>
        user.username?.toLowerCase() === trimmedUsername.toLowerCase() &&
        user.id !== currentUser.id
    );

    if (usernameTaken) {
      setProfileError("This username is already taken.");
      return;
    }

    const emailTaken = allUsers.some(
      (user) =>
        user.email?.toLowerCase() === trimmedEmail.toLowerCase() &&
        user.id !== currentUser.id
    );

    if (emailTaken) {
      setProfileError("This email is already being used by another account.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      username: trimmedUsername,
      email: trimmedEmail,
    };

    const updatedUsers = allUsers.map((user) =>
      user.id === currentUser.id
        ? { ...user, username: trimmedUsername, email: trimmedEmail }
        : user
    );

    setCurrentUser(updatedUser);
    setAllUsers(updatedUsers);

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    setProfileMessage("Profile updated successfully.");
    setIsEditingProfile(false);
  }

  function handleSavePassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if ((currentUser.password || "") !== currentPassword) {
      setPasswordError("Current password is incorrect.");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "New password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "New password must be different from the current password."
      );
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword,
    };

    const updatedUsers = allUsers.map((user) =>
      user.id === currentUser.id ? { ...user, password: newPassword } : user
    );

    setCurrentUser(updatedUser);
    setAllUsers(updatedUsers);

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("Password updated successfully.");
    setIsEditingPassword(false);
  }

  function handleCancelProfileEdit() {
    setProfileError("");
    setProfileMessage("");
    setProfileForm({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
    });
    setIsEditingProfile(false);
  }

  function handleCancelPasswordEdit() {
    setPasswordError("");
    setPasswordMessage("");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
  }

  function openProfileEdit() {
    setProfileError("");
    setProfileMessage("");
    setIsEditingProfile(true);
  }

  function openPasswordEdit() {
    setPasswordError("");
    setPasswordMessage("");
    setIsEditingPassword(true);
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-inherit">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
        <motion.section
          variants={smoothDrop}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]"
        >
          <div className="absolute -top-16 -right-16 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-brand-deep/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl border border-white/10 bg-brand/20 shadow-lg">
                <ShieldCheck
                  size={32}
                  className="sm:w-10 sm:h-10 lg:w-10.5 lg:h-10.5"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-inherit/60">
                  Admin Profile
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
                  {currentUser.fullName || currentUser.username}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-inherit/75 break-all">
                  {currentUser.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs sm:text-sm capitalize">
                    Role: Admin
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs sm:text-sm">
                    System Control
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="cursor-pointer w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-inherit transition-all hover:bg-white/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </motion.section>

        <motion.section
          variants={smoothDrop}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3"
        >
          <div className="xl:col-span-1 space-y-5 sm:space-y-6">
            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                  <UserCircle2 size={22} className="sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold">
                    Account Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-inherit/65">
                    Main admin account details
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Username
                  </p>
                  <p className="font-medium break-words text-sm sm:text-base">
                    {currentUser.username}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Email</p>
                  <p className="font-medium break-all text-sm sm:text-base">
                    {currentUser.email}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Role</p>
                  <p className="font-medium text-sm sm:text-base">Admin</p>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                  <Edit3 size={20} className="sm:w-5.5 sm:h-5.5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Quick Actions</h2>
                  <p className="text-xs sm:text-sm text-inherit/65">
                    Fast shortcuts for admin tools
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={openProfileEdit}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:bg-white/10"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={openPasswordEdit}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:bg-white/10"
                >
                  <Lock size={16} />
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("admin-users")}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:bg-white/10"
                >
                  <Users size={16} />
                  User Management
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("admin-tournaments")}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:bg-white/10"
                >
                  <Trophy size={16} />
                  Tournament Control
                </button>
              </div>
            </motion.section>

            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                  <Swords size={20} className="sm:w-5.5 sm:h-5.5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Teams & Matches</h2>
                  <p className="text-xs sm:text-sm text-inherit/65">
                    Quick summary of teams and match records
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Teams</p>
                  <p className="text-lg font-bold">{totalTeams}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Matches</p>
                  <p className="text-lg font-bold">{totalMatches}</p>
                </div>
              </div>
            </motion.section>
          </div>

          <div className="xl:col-span-2 space-y-5 sm:space-y-6">
            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                    <CalendarDays size={20} className="sm:w-5.5 sm:h-5.5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold">System Stats</h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Quick overview of the platform
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-brand/20 px-3 py-2 text-sm font-medium text-inherit transition-all hover:bg-brand/40 whitespace-nowrap"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Admins</p>
                  <p className="font-bold text-lg">{totalAdmins}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Players</p>
                  <p className="font-bold text-lg">{totalPlayers}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Coaches</p>
                  <p className="font-bold text-lg">{totalCoaches}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Teams</p>
                  <p className="font-bold text-lg">{totalTeams}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Tournaments</p>
                  <p className="font-bold text-lg">{totalTournaments}</p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Active Tournaments
                  </p>
                  <p className="font-bold text-lg">{activeTournaments}</p>
                </div>
              </div>
            </motion.section>

            {profileMessage && (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              >
                {profileMessage}
              </motion.section>
            )}

            {profileError && (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-xl sm:rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                {profileError}
              </motion.section>
            )}

            {isEditingProfile && (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                    <UserCircle2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Edit Profile</h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Update your admin account information
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="mb-2 block text-sm text-inherit/75">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-inherit/75">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 py-3 text-sm font-medium transition-all hover:bg-brand"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelProfileEdit}
                      className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all hover:bg-white/10"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.section>
            )}

            {passwordMessage && (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              >
                {passwordMessage}
              </motion.section>
            )}

            {passwordError && (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-xl sm:rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                {passwordError}
              </motion.section>
            )}

            {isEditingPassword ? (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Change Password
                    </h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Keep your admin account secure
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-inherit/75">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-inherit/65 hover:text-inherit"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-inherit/75">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-inherit/65 hover:text-inherit"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-inherit/75">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-inherit/65 hover:text-inherit"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 py-3 text-sm font-medium transition-all hover:bg-brand"
                    >
                      <Save size={16} />
                      Save Password
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelPasswordEdit}
                      className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all hover:bg-white/10"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.section>
            ) : (
              <motion.section
                variants={smoothDrop}
                initial="hidden"
                animate="visible"
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-brand/20">
                      <Lock size={18} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold">
                        Password Settings
                      </h2>
                      <p className="text-xs sm:text-sm text-inherit/65">
                        Keep your admin account secure
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={openPasswordEdit}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all border-white/10 bg-brand/20 hover:bg-brand/50"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-inherit/65">
                    Your password is protected. Use the button above to update it.
                  </p>
                </div>
              </motion.section>
            )}

            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              id="admin-users"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                  <Users size={20} className="sm:w-5.5 sm:h-5.5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
                  <p className="text-xs sm:text-sm text-inherit/65">
                    Preview of registered users
                  </p>
                </div>
              </div>

              {recentUsers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base break-words">
                            {user.fullName || user.username}
                          </p>
                          <p className="text-xs sm:text-sm text-inherit/60 break-all">
                            {user.email || "-"}
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs capitalize">
                          {user.role || "user"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-inherit/70">
                  No users found.
                </div>
              )}
            </motion.section>

            <motion.section
              variants={smoothDrop}
              initial="hidden"
              animate="visible"
              id="admin-tournaments"
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                    <Trophy size={20} className="sm:w-5.5 sm:h-5.5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Tournament Control
                    </h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Recent tournaments from your system
                    </p>
                  </div>
                </div>

                {safeTournaments.length > 4 && (
                  <Link
                    to="/tournaments"
                    className="inline-flex w-fit items-center rounded-xl border border-white/10 bg-brand/20 px-3 py-2 text-sm font-medium text-inherit transition-all hover:bg-brand/40"
                  >
                    View all
                  </Link>
                )}
              </div>

              {recentTournaments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {recentTournaments.map((tournament, index) => (
                    <div
                      key={tournament.id || index}
                      className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-base sm:text-lg break-words">
                            {tournament.name || tournament.title || "Tournament"}
                          </p>
                          <p className="mt-1 text-sm text-inherit/60 break-words">
                            {tournament.location ||
                              tournament.season ||
                              tournament.category ||
                              "No extra details"}
                          </p>
                        </div>

                        <span className="w-fit shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs capitalize">
                          {tournament.status || "unknown"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-inherit/70">
                  No tournaments available.
                </div>
              )}
            </motion.section>
          </div>
        </motion.section>
      </div>
    </div>
  );
}