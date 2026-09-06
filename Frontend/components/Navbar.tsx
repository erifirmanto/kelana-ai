"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "My Journeys" },
  { href: "/chat", label: "AI Chat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(localStorage.getItem("token")));
  }, [pathname]);

  if (!authenticated || pathname === "/login") {
    return null;
  }

  function logout() {
    localStorage.removeItem("token");
    setAuthenticated(false);
    router.push("/login");
  }

  return (
    <header className="kelana-navbar">
      <div className="kelana-navbar-inner">
        <Link href="/" className="kelana-brand" onClick={() => setOpen(false)}>
          <span className="kelana-brand-mark">K</span>
          <span>
            <span className="kelana-brand-name">KelanaAI</span>
            <span className="kelana-brand-tagline">Escape the ordinary.</span>
          </span>
        </Link>

        <nav className={`kelana-nav ${open ? "is-open" : ""}`}>
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`kelana-nav-link ${active ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <button className="kelana-logout" onClick={logout}>
            Log out
          </button>
        </nav>

        <button
          className="kelana-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
