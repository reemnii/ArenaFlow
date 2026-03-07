import React from "react";
import { Trophy, PlusCircle, LayoutDashboard, Github, Mail, Users  } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center px-5 pt-15 pb-10 border-t border-purple-300/20 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Links */}
        <div className="flex justify-center gap-8 mb-8 flex-wrap text-sm text-gray-300">
          <Link to="/tournaments" className="flex items-center gap-2 hover:text-purple-300 transition"><Trophy size={18} />
            Tournaments
          </Link>

          <Link to="/create" className="flex items-center gap-2 hover:text-purple-300 transition"><PlusCircle size={18} />
            Create Tournament
          </Link>
          <Link to="/manage-teams" className="flex items-center gap-2 hover:text-purple-300 transition"><Users size={18} />
                Manage Teams
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-purple-300 transition">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <a href="#" className="hover:text-purple-300 transition">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-purple-300 transition">
            Terms of Service
          </a>

          <a href="https://github.com/reemnii/ArenaFlow" target="_blank" rel="noopener noreferrer"  className="flex items-center gap-2 hover:text-purple-300 transition"><Github size={18} />
            GitHub
          </a>

          <Link to="/contact" className="flex items-center gap-2 hover:text-purple-300 transition">
            <Mail size={18} />
            Contact
          </Link>

        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6">
          ArenaFlow is a platform designed to organize and manage volleyball tournaments,
          track matches, and simplify tournament management.
        </p>

        {/* Copyright */}
        <div className="text-gray-500 text-xs">
          © 2026 ArenaFlow — Volleyball Tournament Management Platform.
        </div>
      </div>
    </footer>
  );
};

export default Footer;