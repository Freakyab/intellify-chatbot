"use client";

import { getSession } from "@/lib/session";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, [router]);

  return (
    <nav
      className="fixed w-full z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>
      <div
        className={`transform transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}>
        <div className="bg-white/80 backdrop-blur-md shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and brand */}
              <div className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AiWord
                </div>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                {session ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <img
                        src={session.user?.image || "/api/placeholder/32/32"}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2 text-gray-700">
                        {session.user?.name}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/" })
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200">
                    Sign in
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900">
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center px-2">
                    <img
                      src={session.user?.image || "/api/placeholder/32/32"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-gray-700">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/logout")}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover trigger area when navbar is hidden */}
      <div
        className={`h-4 w-full bg-transparent ${
          isVisible ? "hidden" : "block"
        }`}
      />
    </nav>
  );
}

export default Navbar;
