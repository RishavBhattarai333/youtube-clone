import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#212121] rounded-2xl p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-lg font-black">VG</span>
          <h1 className="text-white text-2xl font-bold">Sign in</h1>
          <p className="text-gray-400 text-sm">to continue to VideoGram</p>
        </div>

        {/* Error */}
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#121212] text-white border border-[#303030] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#121212] text-white border border-[#303030] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}