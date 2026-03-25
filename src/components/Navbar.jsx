import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { User, Menu, X, Sun, Moon } from "lucide-react";
import ButtonOutline from "../layouts/ButtonOutline.jsx";
import logo from "/logo-removebg-preview.png";

export default function Navbar() {
  const [scrollActive, setScrollActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const location = useLocation();

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 THEME LOGIC (important part)
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // user check
  useEffect(() => {
    let currentUser = null;
    try {
      currentUser =
        JSON.parse(localStorage.getItem("currentUser")) ||
        JSON.parse(sessionStorage.getItem("currentUser"));
      setIsLoggedIn(!!currentUser);
    } catch (error) {
      setIsLoggedIn(false);
    }
  }, [location]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navLinkClass =
    "relative transition-all hover:text-brand-deep after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-brand-deep after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  const mobileLinkClass =
    "block py-3 px-4 rounded-lg hover:bg-white/10 hover:text-brand-deep transition-all";

  return (
    <nav
      className={
        "fixed top-0 w-full z-30 transition-all bg-white/5 backdrop-blur-[20px] border border-white/10 lg:rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-6 text-main " +
        (scrollActive ? "py-3" : "py-4")
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="scale-110 transition-transform duration-300 hover:scale-120"
        >
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden lg:flex items-center gap-8 text-main font-medium">
          <li>
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/tournaments" className={navLinkClass}>
              Tournaments
            </Link>
          </li>
          <li>
            <Link to="/participants" className={navLinkClass}>
              Teams
            </Link>
          </li>
          <li>
            <Link to="/create" className={navLinkClass}>
              Create Tournament
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4">
          {/* THEME BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-white/10 transition-all"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* USER */}
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="hover:text-brand-deep transition-all"
            >
              <User size={28} className="cursor-pointer" />
            </Link>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                Sign In
              </Link>
              <Link to="/register">
                <ButtonOutline>Sign Up</ButtonOutline>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Menu
            size={28}
            className={`absolute transition-all duration-300 ${
              menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            size={28}
            className={`absolute transition-all duration-300 ${
              menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <ul className="flex flex-col text-main font-medium">
            <li>
              <button
                onClick={toggleTheme}
                className={`${mobileLinkClass} w-full text-left`}
              >
                {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
              </button>
            </li>

            <li>
              <Link to="/" className={mobileLinkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/tournaments" className={mobileLinkClass}>
                Tournaments
              </Link>
            </li>
            <li>
              <Link to="/participants" className={mobileLinkClass}>
                Teams
              </Link>
            </li>
            <li>
              <Link to="/create" className={mobileLinkClass}>
                Create Tournament
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}