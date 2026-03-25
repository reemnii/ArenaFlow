import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { users as defaultUsers } from "../data/users";

export default function Login() {
  //stores emai lor username input
  const [identifier, setIdentifier] = useState("");
  //stores password input
  const [password, setPassword] = useState("");
  //controls the "stay signed in" checkbox
  const [remember, setRemember] = useState(false);
  //stores login error message
  const [error, setError] = useState("");
  //toggles password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    //check if user is already logged in
    const storedUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));
    //redirect to dashboard if user is logged in
    if (storedUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    //remove extra spaces from email/username input
    const trimmedIdentifier = identifier.trim();
    //validate required fields
    if (!trimmedIdentifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    let savedUsers = [];

    try {
      //Get users saved in localstorage
      savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      savedUsers = [];
    }
    //combine deafult users with saved users
    const allUsers = [...defaultUsers, ...savedUsers];

    //find matching user by email/username and password
    const user = allUsers.find(
      (u) =>
        (u.email.toLowerCase() === trimmedIdentifier.toLowerCase() ||
          u.username.toLowerCase() === trimmedIdentifier.toLowerCase()) &&
        u.password === password
    );

    //show erroe if login fails
    if (!user) {
      setError("Invalid email/username or password");
      return;
    }

    //store only safe user data
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "player",
    };
    
    //save login in localstorage if user wants to stay signed in
    if (remember) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("currentUser");
    } else {
      //otherwise keep login only for current session
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
    }

    //clear error and move to dashboard
    setError("");
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-inherit">
          Login
        </h2>

        {/* Shows error message if login fails */}
        {error && (
          <p className="text-brand mb-4 text-sm font-semibold" role="alert">
            {error}
          </p>
        )}

        <label
          htmlFor="identifier"
          className="block mb-2 text-sm font-medium text-inherit"
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
          className="block mb-2 text-sm font-medium text-inherit"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-white/20 bg-white/10 text-white rounded p-3 outline-none pr-10 placeholder:text-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button to show or hide password */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-inherit/70 hover:text-inherit"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

         {/* Remember login choice */}
        <label className="flex items-center text-sm text-inherit mb-4 mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Stay signed in
        </label>

        {/* Link to reset password page */}
        <Link
          to="/forgot-password"
          className="text-left text-sm text-inherit mb-4 mt-1 cursor-pointer hover:underline block"
        >
          Forgot Password?
        </Link>

        {/* Submit login form */}
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