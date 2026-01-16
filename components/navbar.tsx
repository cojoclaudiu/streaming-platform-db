"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Film, Tv, Users, GitCompare, BarChart3 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const links = [
    { href: "/", label: "Media", icon: Database },
    { href: "/movies", label: "Filme", icon: Film },
    { href: "/series", label: "Seriale", icon: Tv },
    { href: "/users", label: "Utilizatori", icon: Users },
    { href: "/recommendations", label: "Recomandări", icon: GitCompare },
    { href: "/statistics", label: "Statistici", icon: BarChart3 },
  ];

  return (
    <header className="border-b bg-background">
      <div className="flex h-12 items-center gap-2 px-4">
        {/* Logo / DB name */}
        <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 mr-4">
          <Database className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm font-semibold text-foreground">
            platforma_streaming
          </span>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors
                  ${
                    active
                      ? "bg-accent text-accent-foreground ring-1 ring-primary/40"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }
                `}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
