import React from "react";
import { Trophy, PlusCircle, LayoutDashboard, Github, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-purple-300/20 bg-black/50 backdrop-blur-xl text-white">

      {/* Mobile Footer*/}
      <div className="md:hidden px-5 pt-6 pb-8 text-xs">
        {/* Brand */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">ArenaFlow</h2>
          <p className="text-gray-400 text-sm">
            ArenaFlow is a platform designed to organize and manage volleyball tournaments.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm items-center justify-items-center">
          {/* Navigation */}
          <div className="pl-15">
            <h3 className="font-semibold mb-3">Navigation</h3>

            <div className="flex flex-col gap-3 text-gray-300">
              <Link to="/tournaments" className="flex items-center gap-2 hover:text-purple-300 transition">
                <Trophy size={18}/> Tournaments
              </Link>

              <Link to="/create" className="flex items-center gap-2 hover:text-purple-300 transition">
                <PlusCircle size={16}/> Create Tournament
              </Link>

              <Link to="/participants" className="flex items-center gap-2 hover:text-purple-300 transition">
                <Users size={18}/> Manage Teams
              </Link>

              <Link to="/dashboard" className="flex items-center gap-2 hover:text-purple-300 transition">
                <LayoutDashboard size={18}/> Dashboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <div className="flex flex-col gap-3 text-gray-300">
              <Link to="/contact" className="flex items-center gap-2 hover:text-purple-300 transition">
                <Mail size={18}/> Contact
              </Link>

              <a
                href="https://github.com/reemnii/ArenaFlow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-purple-300 transition"
              >
                <Github size={18}/> GitHub
              </a>

              <Link to="/privacy" className="hover:text-purple-300 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-purple-300 transition">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 mt-6 text-center text-xs text-gray-500">
          © 2026 ArenaFlow — Volleyball Tournament Management Platform.
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block px-5 pt-6 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col align-center gap-4">

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

            {/* Brand / About */}
            <div className="md:max-w-sm text-center pl-15 md:text-left">
              <h2 className="text-xl font-semibold mb-3">ArenaFlow</h2>
              <p className="text-gray-400 text-sm leading-6">
                ArenaFlow is a platform designed to organize and manage volleyball tournaments,
                track matches, and simplify tournament management.
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center md:text-left">
              <h3 className="text-base font-semibold mb-3">Navigation</h3>

              <div className="flex flex-col gap-3 text-sm text-gray-300">

                <Link to="/tournaments" className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition">
                  <Trophy size={18}/> Tournaments
                </Link>

                <Link to="/create" className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition">
                  <PlusCircle size={18}/> Create Tournament
                </Link>

                <Link to="/participants" className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition">
                  <Users size={18}/> Manage Teams
                </Link>

                <Link to="/dashboard" className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition">
                  <LayoutDashboard size={18}/> Dashboard
                </Link>

              </div>
            </div>

            {/* Support */}
            <div className="text-center md:text-left pr-15">
              <h3 className="text-base font-semibold mb-3">Support</h3>

              <div className="flex flex-col gap-3 text-sm text-gray-300">

                <Link to="/contact" className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition">
                  <Mail size={18}/> Contact
                </Link>

                <a
                  href="https://github.com/reemnii/ArenaFlow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2 hover:text-purple-300 transition"
                >
                  <Github size={18}/> GitHub
                </a>

                <Link to="/privacy" className="hover:text-purple-300 transition">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-purple-300 transition">Terms of Service</Link>

              </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 text-center text-xs text-gray-500">
            © 2026 ArenaFlow — Volleyball Tournament Management Platform.
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;