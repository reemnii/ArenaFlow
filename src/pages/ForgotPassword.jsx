import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { users as defaultUsers } from "../data/users";

export default function ForgotPassword() {
  // Stores the entered email
  const [email, setEmail] = useState("");
  // Stores error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Clear previous messages 
    setError("");
    setSuccess("");

    // Check if email field is empty
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    let savedUsers = [];

    try {
      // Get users stored in localStorage
      savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      savedUsers = [];
    }

    // Combine default users with saved users
    const allUsers = [...defaultUsers, ...savedUsers];

    // Check if the email exists
    const existingUser = allUsers.find(
      (user) => user.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (!existingUser) {
      setError("No account found with this email");
      return;
    }

    // Demo success message instead of real email sending
    setSuccess(
      "Password reset instructions have been sent successfully. (Demo version)"
    );
    setEmail("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg rounded-[20px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-[20px] sm:p-8 md:p-10"
      >
        {/* Top icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <Mail size={24} className="text-inherit" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-bold text-inherit sm:text-2xl">
          Forgot Password
        </h2>

        <p className="mb-6 text-center text-sm text-inherit/70">
          Enter your email address and we’ll help you reset your password.
        </p>

        {/* Error message */}
        {error && (
          <p className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
            {error}
          </p>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-inherit">
          Email Address
        </label>

        {/* Email input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="mb-5 w-full rounded border border-white/20 bg-white/10 p-3 text-inherit outline-none placeholder:text-inherit/40"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full rounded bg-brand py-3 text-inherit transition hover:bg-brand/90"
        >
          Send Reset Link
        </button>

        {/* Back to login link */}
        <Link
          to="/login"
          className="mt-5 flex items-center justify-center gap-2 text-sm text-inherit/80 transition hover:text-inherit hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </form>
    </div>
  );
}