import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCircle2,
  Mail,
  ShieldCheck,
  Edit3,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  LogOut,
  IdCard,
} from "lucide-react";
import { users as defaultUsers } from "../data/users";
import { men_players } from "../data/men_players";
import { women_players } from "../data/women_players";
import AdminProfile from "../components/AdminProfile";

import femalePlayerAvatar from "/avatars/volleyball-player.png";
import malePlayerAvatar from "/avatars/volleyball.png";
import femaleCoachAvatar from "/avatars/coach.png";
import maleCoachAvatar from "/avatars/trainer.png";

export default function UserProfile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerTeam, setPlayerTeam] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingCompleteProfile, setIsEditingCompleteProfile] =
    useState(false);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  const [completeProfileForm, setCompleteProfileForm] = useState({
    fullName: "",
    teamName: "",
    position: "",
    jerseyNumber: "",
    gender: "",
    phone: "",
    age: "",
    yearsExperience: "",
    specialization: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [completeProfileMessage, setCompleteProfileMessage] = useState("");

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [completeProfileError, setCompleteProfileError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allPlayers = useMemo(() => {
    const safeMen = Array.isArray(men_players) ? men_players : [];
    const safeWomen = Array.isArray(women_players) ? women_players : [];
    return [...safeMen, ...safeWomen];
  }, []);

  useEffect(() => {
    let storedCurrentUser = null;
    let storedUsers = [];
    let storedTeams = [];

    try {
      storedCurrentUser =
        JSON.parse(localStorage.getItem("currentUser")) ||
        JSON.parse(sessionStorage.getItem("currentUser"));
      storedUsers = JSON.parse(localStorage.getItem("users")) || defaultUsers;
      storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    } catch (error) {
      storedCurrentUser = null;
      storedUsers = defaultUsers;
      storedTeams = [];
    }

    if (!storedCurrentUser) {
      navigate("/login", { replace: true });
      return;
    }

    const safeUsers = Array.isArray(storedUsers) ? storedUsers : defaultUsers;
    const safeTeams = Array.isArray(storedTeams) ? storedTeams : [];

    const matchedUser =
      safeUsers.find((user) => user.id === storedCurrentUser.id) ||
      storedCurrentUser;

    const normalizedUsername = matchedUser.username?.trim().toLowerCase() || "";
    const normalizedEmail = matchedUser.email?.trim().toLowerCase() || "";
    const normalizedRole = matchedUser.role?.trim().toLowerCase() || "";
    const normalizedPlayerName =
      matchedUser.playerName?.trim().toLowerCase() || "";

    let matchedPlayer = null;
    let matchedTeam = null;

    if (normalizedRole === "player") {
      matchedPlayer =
        allPlayers.find(
          (player) =>
            player.name?.trim().toLowerCase() === normalizedPlayerName ||
            player.name?.trim().toLowerCase() === normalizedUsername
        ) || null;

      if (matchedPlayer) {
        matchedTeam =
          safeTeams.find(
            (team) =>
              String(team.id) === String(matchedPlayer.teamId) ||
              String(team.teamId) === String(matchedPlayer.teamId)
          ) || null;
      }
    }

    if (normalizedRole === "coach") {
      matchedTeam =
        safeTeams.find(
          (team) =>
            team.coach?.trim().toLowerCase() === normalizedUsername ||
            team.coach?.trim().toLowerCase() === normalizedEmail ||
            team.coachEmail?.trim().toLowerCase() === normalizedEmail
        ) || null;
    }

    setCurrentUser(matchedUser);
    setAllUsers(safeUsers);
    setPlayerInfo(normalizedRole === "player" ? matchedPlayer : null);
    setPlayerTeam(normalizedRole === "admin" ? null : matchedTeam);

    setProfileForm({
      username: matchedUser.username || "",
      email: matchedUser.email || "",
    });

    setCompleteProfileForm({
      fullName: matchedUser.fullName || "",
      teamName: matchedUser.teamName || matchedTeam?.name || "",
      position: matchedUser.position || matchedPlayer?.position || "",
      jerseyNumber: matchedUser.jerseyNumber || "",
      gender: matchedUser.gender || "",
      phone: matchedUser.phone || "",
      age: matchedUser.age || "",
      yearsExperience: matchedUser.yearsExperience || "",
      specialization: matchedUser.specialization || "",
    });
  }, [navigate, allPlayers]);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCompleteProfileChange(e) {
    const { name, value } = e.target;
    setCompleteProfileForm((prev) => ({
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

  function handleSaveCompleteProfile(e) {
    e.preventDefault();
    setCompleteProfileError("");
    setCompleteProfileMessage("");

    const userRole = currentUser?.role?.trim().toLowerCase() || "";

    if (userRole === "player") {
      if (
        !completeProfileForm.teamName.trim() ||
        !completeProfileForm.position.trim() ||
        !completeProfileForm.jerseyNumber.trim() ||
        !completeProfileForm.gender.trim()
      ) {
        setCompleteProfileError(
          "Please fill in team name, position, jersey number, and gender."
        );
        return;
      }
    }

    if (userRole === "coach") {
      if (
        !completeProfileForm.fullName.trim() ||
        !completeProfileForm.teamName.trim() ||
        !completeProfileForm.gender.trim()
      ) {
        setCompleteProfileError(
          "Please fill in full name, team name, and gender."
        );
        return;
      }
    }

    const updatedUser = {
      ...currentUser,
      ...completeProfileForm,
    };

    const updatedUsers = allUsers.map((user) =>
      user.id === currentUser.id ? { ...user, ...completeProfileForm } : user
    );

    setCurrentUser(updatedUser);
    setAllUsers(updatedUsers);

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    setCompleteProfileMessage("Details updated successfully.");
    setIsEditingCompleteProfile(false);
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

  function handleCancelCompleteProfileEdit() {
    setCompleteProfileError("");
    setCompleteProfileMessage("");
    setCompleteProfileForm({
      fullName: currentUser?.fullName || "",
      teamName: currentUser?.teamName || playerTeam?.name || "",
      position: currentUser?.position || playerInfo?.position || "",
      jerseyNumber: currentUser?.jerseyNumber || "",
      gender: currentUser?.gender || "",
      phone: currentUser?.phone || "",
      age: currentUser?.age || "",
      yearsExperience: currentUser?.yearsExperience || "",
      specialization: currentUser?.specialization || "",
    });
    setIsEditingCompleteProfile(false);
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

  function handleLogout() {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  }

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

  const userRole = currentUser?.role?.trim().toLowerCase() || "";
  const isAdmin = userRole === "admin";
  const isCoach = userRole === "coach";
  const isPlayer = userRole === "player";

  if (!currentUser) {
    return (
      <div className="min-h-screen px-3 sm:px-6 py-6 sm:py-10 text-inherit">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-5 sm:p-8 backdrop-blur-[20px]">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminProfile
        currentUser={currentUser}
        allUsers={allUsers}
        setCurrentUser={setCurrentUser}
        setAllUsers={setAllUsers}
        onLogout={handleLogout}
      />
    );
  }

  const getAvatarConfig = () => {
    const role = currentUser?.role?.trim().toLowerCase() || "";
    const gender = currentUser?.gender?.trim().toLowerCase() || "";
    const jersey = currentUser?.jerseyNumber?.toString().trim() || "";

    let avatarUrl = malePlayerAvatar;
    let badge = "";

    if (role === "player") {
      avatarUrl = gender === "female" ? femalePlayerAvatar : malePlayerAvatar;
      badge = jersey ? `#${jersey}` : "";
    }

    if (role === "coach") {
      avatarUrl = gender === "female" ? femaleCoachAvatar : maleCoachAvatar;
      badge = "COACH";
    }

    return {
      avatarUrl,
      badge,
    };
  };

  const renderPasswordForm = () => (
    <>
      {passwordMessage && (
        <div className="mb-4 rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {passwordMessage}
        </div>
      )}

      {passwordError && (
        <div className="mb-4 rounded-xl sm:rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {passwordError}
        </div>
      )}

      {isEditingPassword ? (
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
                className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm sm:text-base text-inherit outline-none transition-all placeholder:text-inherit/35 focus:border-brand/60 focus:bg-white/10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-inherit/60 transition hover:text-inherit"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm sm:text-base text-inherit outline-none transition-all placeholder:text-inherit/35 focus:border-brand/60 focus:bg-white/10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-inherit/60 transition hover:text-inherit"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm sm:text-base text-inherit outline-none transition-all placeholder:text-inherit/35 focus:border-brand/60 focus:bg-white/10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-inherit/60 transition hover:text-inherit"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-inherit/70">
            Password must be at least 8 characters and include uppercase,
            lowercase, number, and special character.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 py-3 text-sm font-medium transition-all hover:bg-brand"
            >
              <Save size={16} />
              Update Password
            </button>

            <button
              type="button"
              onClick={handleCancelPasswordEdit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all hover:bg-white/10"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-inherit/65">
            Your password is protected. Use the button above to update it.
          </p>
        </div>
      )}
    </>
  );

  const renderProfileHighlights = () => {
    const avatar = getAvatarConfig();

    return (
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        <div className="relative mx-auto mb-4 w-fit">
          <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-lg">
            <img
              src={avatar.avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {avatar.badge && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-brand px-3 py-1 text-[11px] font-semibold text-inherit shadow-md">
              {avatar.badge}
            </div>
          )}
        </div>

        <h3 className="text-center text-lg sm:text-xl font-bold wrap-break-word">
          {currentUser.fullName || currentUser.username}
        </h3>

        <p className="mt-1 text-center text-sm text-inherit/70">
          {avatar.subLabel}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
            <p className="text-xs text-inherit/60">Team</p>
            <p className="mt-1 text-sm font-medium wrap-break-word">
              {currentUser.teamName || playerTeam?.name || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
            <p className="text-xs text-inherit/60">
              {isCoach ? "Specialization" : "Position"}
            </p>

            <p className="mt-1 text-sm font-medium capitalize">
              {isCoach
                ? currentUser.specialization || "-"
                : currentUser.position || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
            <p className="text-xs text-inherit/60">Jersey</p>
            <p className="mt-1 text-sm font-medium">
              {currentUser.jerseyNumber || (isCoach ? "COACH" : "-")}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
            <p className="text-xs text-inherit/60">Gender</p>
            <p className="mt-1 text-sm font-medium capitalize wrap-break-word">
              {currentUser.gender || "-"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailsSection = () => {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
              <IdCard size={20} className="sm:w-5.5 sm:h-5.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isPlayer ? "Player Details" : "Coach Details"}
              </h2>
              <p className="text-xs sm:text-sm text-inherit/65">
                {isPlayer
                  ? "Complete and manage your player information"
                  : "Complete and manage your coach information"}
              </p>
            </div>
          </div>

          {!isEditingCompleteProfile && (
            <button
              onClick={() => {
                setCompleteProfileError("");
                setCompleteProfileMessage("");
                setIsEditingCompleteProfile(true);
              }}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-4 py-2.5 text-sm font-medium transition-all hover:bg-brand"
            >
              <Edit3 size={16} />
              Edit Details
            </button>
          )}
        </div>

        {completeProfileMessage && (
          <div className="mb-4 rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {completeProfileMessage}
          </div>
        )}

        {completeProfileError && (
          <div className="mb-4 rounded-xl sm:rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {completeProfileError}
          </div>
        )}

        {isEditingCompleteProfile ? (
          <form
            onSubmit={handleSaveCompleteProfile}
            className="space-y-4 sm:space-y-5"
          >
            {isPlayer && (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={completeProfileForm.teamName}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={completeProfileForm.position}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter position"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Jersey Number
                  </label>
                  <input
                    type="text"
                    name="jerseyNumber"
                    value={completeProfileForm.jerseyNumber}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter jersey number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Gender
                  </label>
                  <input
                    type="text"
                    name="gender"
                    value={completeProfileForm.gender}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter gender"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={completeProfileForm.phone}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={completeProfileForm.age}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter age"
                  />
                </div>
              </div>
            )}

            {isCoach && (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={completeProfileForm.fullName}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={completeProfileForm.teamName}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Gender
                  </label>
                  <input
                    type="text"
                    name="gender"
                    value={completeProfileForm.gender}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter gender"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={completeProfileForm.phone}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="yearsExperience"
                    value={completeProfileForm.yearsExperience}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter years of experience"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-inherit/75">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={completeProfileForm.specialization}
                    onChange={handleCompleteProfileChange}
                    className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-inherit outline-none focus:border-brand/60 focus:bg-white/10"
                    placeholder="Enter specialization"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 py-3 text-sm font-medium transition-all hover:bg-brand"
              >
                <Save size={16} />
                Save Details
              </button>

              <button
                type="button"
                onClick={handleCancelCompleteProfileEdit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all hover:bg-white/10"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
            {isPlayer && (
              <>
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Team Name
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.teamName || playerTeam?.name || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Position
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.position || playerInfo?.position || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Jersey Number
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {currentUser.jerseyNumber || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Gender
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.gender || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Phone
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.phone || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">Age</p>
                  <p className="font-medium text-sm sm:text-base">
                    {currentUser.age || "-"}
                  </p>
                </div>
              </>
            )}

            {isCoach && (
              <>
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Full Name
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.fullName || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Team Name
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.teamName || playerTeam?.name || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Gender
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.gender || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Phone
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.phone || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Years of Experience
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {currentUser.yearsExperience || "-"}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                    Specialization
                  </p>
                  <p className="font-medium text-sm sm:text-base wrap-break-word">
                    {currentUser.specialization || "-"}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-inherit">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
        <motion.section
          variants={smoothDrop}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]"
        >
          <div className="absolute -top-16 -right-16 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-brand/20 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-brand-deep/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl border border-white/10 bg-brand/20 shadow-lg">
                <UserCircle2
                  size={32}
                  className="sm:w-10 sm:h-10 lg:w-10.5 lg:h-10.5"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-inherit/60">
                  User Profile
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight wrap-break-word">
                  {currentUser.username}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-inherit/75">
                  Manage your account information and update your profile
                  securely.
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs sm:text-sm capitalize">
                    Role: {currentUser.role}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs sm:text-sm">
                    Account Settings
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-inherit transition-all hover:bg-white/10"
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
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                  <UserCircle2 size={22} className="sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold">
                    Account Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-inherit/65">
                    Your main account details
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-inherit/60">
                    <UserCircle2 size={15} />
                    <p className="text-xs sm:text-sm">Username</p>
                  </div>
                  <p className="font-medium wrap-break-word text-sm sm:text-base">
                    {currentUser.username}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-inherit/60">
                    <Mail size={15} />
                    <p className="text-xs sm:text-sm">Email</p>
                  </div>
                  <p className="font-medium break-all text-sm sm:text-base">
                    {currentUser.email}
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-inherit/60">
                    <ShieldCheck size={15} />
                    <p className="text-xs sm:text-sm">Role</p>
                  </div>
                  <p className="font-medium capitalize text-sm sm:text-base">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>

            {renderProfileHighlights()}
          </div>

          <div className="xl:col-span-2 space-y-5 sm:space-y-6">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-brand/20">
                    <Edit3 size={20} className="sm:w-5.5 sm:h-5.5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Edit Profile
                    </h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Update your personal information
                    </p>
                  </div>
                </div>

                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setProfileError("");
                      setProfileMessage("");
                      setIsEditingProfile(true);
                    }}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-4 py-2.5 text-sm font-medium transition-all hover:bg-brand"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {profileMessage && (
                <div className="mb-5 rounded-xl sm:rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <p className="mt-2 text-sm font-medium text-brand">
                  {profileError}
                </p>
              )}

              {isEditingProfile ? (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-4 sm:space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm text-inherit/75">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base text-inherit outline-none transition-all placeholder:text-inherit/35 focus:border-brand/60 focus:bg-white/10"
                      placeholder="Enter your username"
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
                      className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base text-inherit outline-none transition-all placeholder:text-inherit/35 focus:border-brand/60 focus:bg-white/10"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 py-3 text-sm font-medium transition-all hover:bg-brand"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelProfileEdit}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all hover:bg-white/10"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                      Username
                    </p>
                    <p className="font-medium wrap-break-word text-sm sm:text-base">
                      {currentUser.username}
                    </p>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <p className="mb-1 text-xs sm:text-sm text-inherit/60">
                      Email
                    </p>
                    <p className="font-medium break-all text-sm sm:text-base">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {renderDetailsSection()}

            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-brand/20">
                    <Lock size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold">
                      Edit Password
                    </h2>
                    <p className="text-xs sm:text-sm text-inherit/65">
                      Keep your account secure
                    </p>
                  </div>
                </div>

                {!isEditingPassword && (
                  <button
                    onClick={() => {
                      setPasswordError("");
                      setPasswordMessage("");
                      setIsEditingPassword(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand/80 px-4 py-2.5 text-sm font-medium transition-all hover:bg-brand"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                )}
              </div>

              {renderPasswordForm()}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}