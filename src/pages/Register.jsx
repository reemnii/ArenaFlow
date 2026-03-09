import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedUsername || !trimmedEmail || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character"
      );
      return;
    }

    let storedUsers = [];

    try {
      storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      storedUsers = [];
    }

    const emailExists = storedUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (emailExists) {
      setError("Email already registered");
      return;
    }

    const usernameExists = storedUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (usernameExists) {
      setError("Username already taken");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    };

    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    setError("");
    navigate("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">
          Register
        </h2>

        {error && (
          <p className="text-[#913075] mb-4 text-sm font-semibold" role="alert">
            {error}
          </p>
        )}

        <label
          htmlFor="register-username"
          className="block mb-2 text-sm font-medium text-white"
        >
          Username
        </label>

        <input
          id="register-username"
          type="text"
          placeholder="Enter your username"
          className="w-full border border-white/20 bg-white/10 text-white rounded p-3 mb-4 outline-none placeholder:text-white/50"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label
          htmlFor="register-email"
          className="block mb-2 text-sm font-medium text-white"
        >
          Email
        </label>

        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          className="w-full border border-white/20 bg-white/10 text-white rounded p-3 mb-4 outline-none placeholder:text-white/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label
          htmlFor="register-password"
          className="block mb-2 text-sm font-medium text-white"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-white/20 bg-white/10 text-white rounded p-3 mb-2 outline-none pr-10 placeholder:text-white/50"
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

        <p className="text-xs text-white/70 mb-4">
          Password must be at least 8 characters and include uppercase,
          lowercase, a number, and a special character.
        </p>

        <button
          type="submit"
          className="w-full bg-brand text-white py-3 rounded hover:bg-brand/90 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
