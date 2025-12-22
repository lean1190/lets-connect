"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/houston", label: "Dashboard" },
    { href: "/houston/stats", label: "Statistics" },
  ];

  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/houston" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
