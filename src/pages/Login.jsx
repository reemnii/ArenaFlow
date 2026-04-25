import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "../utils/api";
import { getStoredAuth, setStoredAuth } from "../utils/auth";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getStoredAuth().isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: {
          identifier: identifier.trim(),
          password,
        },
      });

      setStoredAuth({
        token: data.token,
        user: data.user,
        remember,
      });

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-4 w-full max-w-md sm:max-w-lg">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-inherit transition hover:text-brand"
        >
          <ArrowLeft size={14} />
          Go back to Home
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[20px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-[20px] sm:max-w-lg sm:p-8 md:p-10"
      >
        <h2 className="mb-6 text-center text-xl font-bold text-inherit sm:text-2xl">
          Login
        </h2>

        {error && (
          <p className="mb-4 text-sm font-semibold text-brand" role="alert">
            {error}
          </p>
        )}

        <label
          htmlFor="identifier"
          className="mb-2 block text-sm font-medium text-inherit"
        >
          Email or Username
        </label>
        <input
          id="identifier"
          type="text"
          placeholder="Enter your email or username"
          className="mb-4 w-full rounded p-3 text-white outline-none border border-white/20 bg-white/10 placeholder:text-white/50"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />

        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-medium text-inherit"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full rounded p-3 pr-10 text-white outline-none border border-white/20 bg-white/10 placeholder:text-white/50"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-inherit/70 hover:text-inherit"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <label className="mb-4 mt-4 flex items-center text-sm text-inherit">
          <input
            type="checkbox"
            className="mr-2"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Stay signed in
        </label>

        <Link
          to="/forgot-password"
          className="mb-4 mt-1 block text-left text-sm text-inherit hover:underline"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-brand py-3 text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-left text-sm text-inherit">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
