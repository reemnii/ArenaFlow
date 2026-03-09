import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { users as defaultUsers } from "../data/users";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") ||
      sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    let savedUsers = [];

    try {
      savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      savedUsers = [];
    }

    const allUsers = [...defaultUsers, ...savedUsers];

    const user = allUsers.find(
      (u) =>
        (u.email.toLowerCase() === trimmedIdentifier.toLowerCase() ||
          u.username.toLowerCase() === trimmedIdentifier.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
      setError("Invalid email/username or password");
      return;
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    if (remember) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
    }

    setError("");
    navigate("/dashboard");
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {error && (
          <p className="text-brand mb-4 text-sm font-semibold" role="alert">
            {error}
          </p>
        )}

        <label
          htmlFor="identifier"
          className="block mb-2 text-sm font-medium text-white"
        >
          Email / Username
        </label>

        <input
          id="identifier"
          type="text"
          placeholder="Enter your email or username"
          className="w-full border border-white/20 bg-white/10 text-white rounded p-3 mb-4 outline-none placeholder:text-white/50"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label
          htmlFor="login-password"
          className="block mb-2 text-sm font-medium text-white"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-white/20 bg-white/10 text-white rounded p-3 mb-3 outline-none pr-10 placeholder:text-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <label className="flex items-center text-sm text-white mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Stay signed in
        </label>

        <Link
          to="/forgot-password"
          className="text-left text-sm text-white mb-4 mt-1 cursor-pointer hover:underline block"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="w-full bg-brand text-white py-3 rounded hover:bg-brand/90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
