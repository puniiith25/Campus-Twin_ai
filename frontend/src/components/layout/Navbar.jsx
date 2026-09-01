import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Compass, GitFork, Scale, Grid, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const navLinks = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/path", label: "My Path", icon: GitFork },
    { href: "/what-if", label: "What-If", icon: Sparkles },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/opportunities", label: "Opportunities", icon: Grid },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-brand-700 to-indigo-600 bg-clip-text text-transparent">
                CAMPUS TWIN
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                Genie Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-200/60"
                      : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Launch What-If CTA */}
          <div className="flex items-center space-x-3">
            <Link
              to="/what-if"
              className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-semibold shadow-glow hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch What-If</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
