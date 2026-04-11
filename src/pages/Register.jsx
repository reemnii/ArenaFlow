import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  // Form input states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  // Error message state
  const [error, setError] = useState("");
  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    
    // Clean input values
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword || !role) {
      setError("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate strong password
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character"
      );
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    let storedUsers = [];

    try {
      // Get users from localStorage
      storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      storedUsers = [];
    }

    // Check for existing email or username
    const emailExists = storedUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (emailExists) {
      setError("Email already registered");
      return;
    }

    // Check if username already exists
    const usernameExists = storedUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (usernameExists) {
      setError("Username already taken");
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now(),
      username: trimmedUsername,
      email: trimmedEmail,
      password,
      role,
    };

    // Save user to localStorage
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Clear error and redirect to login
    setError("");
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto px-4 py-5 sm:py-6">
  
  <Link
  to="/"
  className="flex items-center gap-2 mb-4 mt-2 text-sm text-inherit hover:text-brand transition cursor-pointer w-full max-w-sm sm:max-w-md"
>
  ← Go back to Home
</Link> 
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] p-4 sm:p-5"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-inherit">
          Register
        </h2>

        {/* Error message */}
        {error && (
          <p className="text-[#913075] mb-3 text-sm font-semibold" role="alert">
            {error}
          </p>
        )}

        {/* Username input */}
        <label
          htmlFor="register-username"
          className="block mb-1.5 text-sm font-medium text-inherit"
        >
          Username
        </label>
        <input
          id="register-username"
          type="text"
          placeholder="Enter your username"
          className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2.5 mb-3 outline-none placeholder:text-white/50"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email input */}
        <label
          htmlFor="register-email"
          className="block mb-1.5 text-sm font-medium text-inherit"
        >
          Email
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2.5 mb-3 outline-none placeholder:text-white/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <label
          htmlFor="register-password"
          className="block mb-1.5 text-sm font-medium text-inherit"
        >
          Password
        </label>
        <div className="relative mb-2">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2.5 outline-none pr-10 placeholder:text-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-inherit/70 hover:text-inherit cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password hint */}
        <p className="text-xs text-inherit/70 mb-3 leading-relaxed">
          Use at least 8 characters with uppercase, lowercase, a number, and a special character.
        </p>

        {/* Confirm Password input */}
        <label
          htmlFor="register-confirm-password"
          className="block mb-1.5 text-sm font-medium text-inherit"
        >
          Confirm Password
        </label>
        <div className="relative mb-3">
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2.5 outline-none pr-10 placeholder:text-white/50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-inherit/70 hover:text-inherit cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role selection */}
        <label
          htmlFor="register-role"
          className="block mb-1.5 text-sm font-medium text-inherit"
        >
          Role
        </label>
        <select
          id="register-role"
          className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2.5 mb-4 outline-none appearance-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled className="bg-[#2a1430] text-white">
            Choose your role
          </option>
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

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-brand text-white py-2.5 rounded-lg hover:bg-brand/90 transition cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}