import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-inherit shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm leading-7 text-inherit/75">
          Password reset is not connected yet in this phase. Use an existing
          account or register a new one through the live backend auth flow.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition hover:bg-brand/90"
          >
            Back to Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
