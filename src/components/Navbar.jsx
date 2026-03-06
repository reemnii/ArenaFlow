import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import ButtonOutline from "../layouts/ButtonOutline.jsx";
import logo from "/logo-removebg-preview.png";

export default function Navbar() {
  const [scrollActive, setScrollActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "relative transition-all hover:text-brand-deep after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-brand-deep after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={"fixed top-0 w-full z-30 transition-all bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 text-white " +(scrollActive ? "shadow-md py-3" : "py-4")}>
        <div className="max-w-7xl mx-auto pl-2 pr-6 sm:pr-8 lg:pr-16 flex items-center justify-between">
          <Link to="/"><img src={logo} alt="Logo" className="h-35 w-70" /></Link>
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
        </div>
      </nav>

      </>
  );
}