import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { User, Menu, X } from "lucide-react";
import ButtonOutline from "../layouts/ButtonOutline.jsx";
import logo from "/logo-removebg-preview.png";

export default function Navbar() {
  const [scrollActive, setScrollActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "relative transition-all hover:text-brand-deep after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-brand-deep after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  const mobileLinkClass =
    "block py-3 px-4 rounded-lg hover:bg-white/10 hover:text-brand-deep transition-all";

  return (
    <nav
      className={
        "fixed top-0 w-full z-30 transition-all bg-white/5 backdrop-blur-[20px] border border-white/10 lg:rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-6 text-white " +
        (scrollActive ? "py-3" : "py-4")
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        <Link to="/" onClick={() => setMenuOpen(false)} className="transition-transform duration-300 hover:scale-110">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-white font-medium">
          <li><Link to="/" className={navLinkClass}>Home</Link></li>
          <li><Link to="/tournaments" className={navLinkClass}>Tournaments</Link></li>
          <li><Link to="/participants" className={navLinkClass}>Teams</Link></li>
          <li><Link to="/create" className={navLinkClass}>Create Tournament</Link></li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <Link to="/dashboard" className="hover:text-brand-deep transition-all"><User size={28} className="cursor-pointer" /></Link>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>Sign In</Link>
              <Link to="/register"><ButtonOutline>Sign Up</ButtonOutline></Link>
            </>
          )}
        </div>

        <button className="lg:hidden relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"><Menu size={28}  className={`absolute transition-all duration-300 ${
              menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            } hover:text-brand-deep hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}/>
          <X size={28} className={`absolute transition-all duration-300 ${
              menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            } hover:text-brand-deep hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}/>
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <ul className="flex flex-col text-white font-medium">
            <li><Link to="/" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/tournaments" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Tournaments</Link></li>
            <li><Link to="/participants" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Teams</Link></li>
            <li><Link to="/create" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Create Tournament</Link></li>
            {isLoggedIn ? (
              <li><Link to="/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            ) : (
              <>
                <li><Link to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Sign In</Link></li>
                <li><Link to="/register" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
                
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}