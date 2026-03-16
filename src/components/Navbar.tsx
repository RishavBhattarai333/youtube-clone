import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// ✅ Single import from assets — remove the old `import logo from "../assets/logo1.png"`
import {
  logo1 as logo,
  menuIcon,
  searchIcon,
  voiceSearchIcon,
  uploadIcon,
  notificationIcon,
} from "../assets";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ for menu toggle
  const navigate = useNavigate();

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userDisplay = {
    name: user?.displayName || user?.email || "User",
    avatar: user?.photoURL,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] flex items-center justify-between px-4 py-2 h-14">

      {/* ── LEFT — Menu icon + Logo ──────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* ✅ Menu/hamburger icon */}
        <img
          src={menuIcon}
          alt="menu"
          className="w-6 h-6 cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          {/* ✅ Logo from assets */}
          <img src={logo} alt="VideoGram Logo" className="h-8 object-contain" />
          <span className="hidden sm:inline">VideoGram</span>
        </Link>
      </div>

      {/* ── CENTER — Search Bar ──────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex items-center flex-1 max-w-xl mx-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-[#121212] text-white border border-[#303030] rounded-l-full px-4 py-1.5 text-sm outline-none focus:border-blue-500"
        />

        {/* ✅ Search icon button */}
        <button
          type="submit"
          className="bg-[#222222] border border-l-0 border-[#303030] text-white px-4 py-1.5 rounded-r-full hover:bg-[#3a3a3a] transition"
        >
          <img src={searchIcon} alt="search" className="w-5 h-5" />
        </button>
      </form>

      {/* ✅ Voice search icon — outside the form */}
      <img
        src={voiceSearchIcon}
        alt="voice search"
        className="w-8 h-8 cursor-pointer hidden sm:block"
      />

      {/* ── RIGHT — Upload, Notification, Auth ──────────────── */}
      <div className="flex items-center gap-3 ml-3">

        {/* ✅ Upload icon — only show when logged in */}
        {isLoggedIn && (
          <img
            src={uploadIcon}
            alt="upload"
            className="w-6 h-6 cursor-pointer"
          />
        )}

        {/* ✅ Notification icon — only show when logged in */}
        {isLoggedIn && (
          <img
            src={notificationIcon}
            alt="notifications"
            className="w-6 h-6 cursor-pointer"
          />
        )}

        {/* Auth — Avatar dropdown or Sign In / Register */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden"
            >
              {userDisplay.avatar ? (
                <img
                  src={userDisplay.avatar}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userDisplay.name.charAt(0).toUpperCase()
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-[#212121] border border-[#303030] rounded-lg shadow-lg w-40 py-1 z-50">
                <Link
                  to="/channel/me"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                  onClick={() => setMenuOpen(false)}
                >
                  Your Channel
                </Link>
                <button
                  onClick={() => { signOut(auth); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-[#303030] text-blue-400 text-sm px-3 py-1.5 rounded-full hover:bg-[#263850] transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-full hover:bg-red-700 transition hidden sm:inline-block"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}