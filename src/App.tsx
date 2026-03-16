import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";
import SearchResults from "./pages/SearchResults";
import ChannelPage from "./pages/ChannelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Subscriptions from "./pages/Subscriptions.tsx";

const noSidebarRoutes = ["/login", "/register"];

function Layout() {
  const location = useLocation();
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Navbar />
      <div className="pt-14 flex">
        {!hideSidebar && <Sidebar />}
        <main className={`flex-1 ${!hideSidebar ? "ml-16 lg:ml-56" : ""}`}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/video/:id"     element={<VideoDetail />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/channel/:id"   element={<ChannelPage />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;