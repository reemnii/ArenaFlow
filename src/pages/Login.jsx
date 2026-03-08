import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  function handleSubmit(e) {
  e.preventDefault();

  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    setError("! Invalid email or password");
    return;
  }

  setError("");
  navigate("/dashboard");
}
  return (
    <div className="flex justify-center items-center min-h-[100vh]" >
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] p-10 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {error && (
          <p className="text-[#913075] mb-4 text-sm font-semibold">{error}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-white">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-white/20 bg-white/10 text-white rounded p-2 mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-white">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-white/20 bg-white/10 text-white rounded p-2 mb-2 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link
          to="/forgot-password"
          className="text-left text-sm text-white mb-4 mt-2 cursor-pointer hover:underline block"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="w-full bg-brand text-white py-2 rounded hover:bg-brand/90"
        >
          Login
        </button>
      </form>
    </div>
  );
}