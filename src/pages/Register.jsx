import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    alert("Registration successful (mock)");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <label className="block mb-2 font-medium">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full border rounded-lg p-2 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border rounded-lg p-2 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}