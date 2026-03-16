import { Link, useLocation } from "react-router-dom";

// ✅ Import all your custom icons
import {
  homeIcon,
  exploreIcon,
  historyIcon,
  libraryIcon,
  subscriptionIcon,
  musicIcon,
  gamesIcon,
  newsIcon,
  sportsIcon,
  techIcon,
  entertainmentIcon,
  automobilesIcon,
  blogsIcon,
} from "../assets";

// ✅ Nav links — replaced emoji with your icon images
const navItems = [
  { path: "/",             icon: homeIcon,         label: "Home" },
  { path: "/trending",     icon: exploreIcon,      label: "Trending" },
  { path: "/subscriptions",icon: subscriptionIcon, label: "Subscriptions" },
  { path: "/history",      icon: historyIcon,      label: "History" },
  { path: "/library",      icon: libraryIcon,      label: "Library" },
];

// ✅ Category links — replaced emoji with your icon images
const categoryItems = [
  { path: "/search/music",         icon: musicIcon,         label: "Music" },
  { path: "/search/gaming",        icon: gamesIcon,         label: "Gaming" },
  { path: "/search/news",          icon: newsIcon,          label: "News" },
  { path: "/search/sports",        icon: sportsIcon,        label: "Sports" },
  { path: "/search/tech",          icon: techIcon,          label: "Technology" },
  { path: "/search/entertainment", icon: entertainmentIcon, label: "Entertainment" },
  { path: "/search/automobiles",   icon: automobilesIcon,   label: "Automobiles" },
  { path: "/search/blogs",         icon: blogsIcon,         label: "Blogs" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-16 lg:w-56 bg-[#0f0f0f] border-r border-[#1f1f1f] flex flex-col py-3 z-40 overflow-y-auto">

      {/* ── Nav Links ────────────────────────────────────────── */}
      {navItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl transition
              ${isActive
                ? "bg-[#272727] text-white font-semibold"
                : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
          >
            {/* ✅ Custom icon image instead of emoji */}
            <img src={icon} alt={label} className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline text-sm">{label}</span>
          </Link>
        );
      })}

      {/* ── Divider + Categories ─────────────────────────────── */}
      <div className="border-t border-[#1f1f1f] my-3 mx-2" />
      <p className="text-gray-500 text-xs px-5 mb-1 hidden lg:block">CATEGORIES</p>

      {categoryItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl transition
              ${isActive
                ? "bg-[#272727] text-white font-semibold"
                : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
          >
            {/* ✅ Custom icon image instead of emoji */}
            <img src={icon} alt={label} className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline text-sm">{label}</span>
          </Link>
        );
      })}

      {/* ── Divider + Sign In / Register ─────────────────────── */}
      <div className="border-t border-[#1f1f1f] my-3 mx-2" />

      <Link
        to="/login"
        className="flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition"
      >
        <span className="text-xl flex-shrink-0">👤</span>
        <span className="hidden lg:inline text-sm">Sign In</span>
      </Link>

      <Link
        to="/register"
        className="flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition"
      >
        <span className="text-xl flex-shrink-0">📝</span>
        <span className="hidden lg:inline text-sm">Register</span>
      </Link>
    </aside>
  );
}