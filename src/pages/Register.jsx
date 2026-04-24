import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("player");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: {
          username: trimmedUsername,
          email: trimmedEmail,
          password,
          role,
        },
      });

      setSuccessMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (requestError) {
      setError(requestError.message || "Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center overflow-y-auto px-4 py-5 sm:py-6">
      <Link
        to="/"
        className="mb-4 mt-2 flex w-full max-w-sm items-center gap-2 text-sm text-inherit transition hover:text-brand sm:max-w-md"
      >
        <ArrowLeft size={14} />
        Go back to Home
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-[20px] sm:max-w-md sm:p-5"
      >
        <h2 className="mb-4 text-center text-lg font-bold text-inherit sm:text-xl">
          Register
        </h2>

        {error && (
          <p className="mb-3 text-sm font-semibold text-[#913075]" role="alert">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mb-3 text-sm font-semibold text-emerald-300" role="status">
            {successMessage}
          </p>
        )}

        <label
          htmlFor="register-username"
          className="mb-1.5 block text-sm font-medium text-inherit"
        >
          Username
        </label>
        <input
          id="register-username"
          type="text"
          placeholder="Enter your username"
          className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-white/50"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label
          htmlFor="register-email"
          className="mb-1.5 block text-sm font-medium text-inherit"
        >
          Email
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-white/50"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label
          htmlFor="register-password"
          className="mb-1.5 block text-sm font-medium text-inherit"
        >
          Password
        </label>
        <div className="relative mb-2">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 pr-10 text-white outline-none placeholder:text-white/50"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-inherit/70 hover:text-inherit"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="mb-3 text-xs leading-relaxed text-inherit/70">
          Use at least 8 characters with uppercase, lowercase, a number, and a
          special character.
        </p>

        <label
          htmlFor="register-confirm-password"
          className="mb-1.5 block text-sm font-medium text-inherit"
        >
          Confirm Password
        </label>
        <div className="relative mb-3">
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 pr-10 text-white outline-none placeholder:text-white/50"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label={
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-inherit/70 hover:text-inherit"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label
          htmlFor="register-role"
          className="mb-1.5 block text-sm font-medium text-inherit"
        >
          Role
        </label>
        <select
          id="register-role"
          className="mb-4 w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white outline-none"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="player" className="bg-[#2a1430] text-white">
            Player
          </option>
          <option value="coach" className="bg-[#2a1430] text-white">
            Coach
          </option>
          <option value="manager" className="bg-[#2a1430] text-white">
            Team Manager
          </option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand py-2.5 text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
