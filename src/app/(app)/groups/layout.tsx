"use client";

import { usePathname } from "next/navigation";

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">
              {pathname === "/groups" ? "Groups" : "Group"}
            </h1>
            <div className="flex items-center gap-2">
              <a href="/my-qr">
                <button
                  type="button"
                  className="bg-[#0A66C2] text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  My QR
                </button>
              </a>
              <a href="/settings">
                <button type="button" className="p-2 text-xl">
                  ⚙️
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-[85px] pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center h-full">
            <a href="/contacts" className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${pathname === "/contacts" ? "bg-[#E8F4FD]" : ""}`}
              >
                <span className="text-xl">👤</span>
              </div>
              <span
                className={`text-xs font-semibold ${pathname === "/contacts" ? "text-[#0A66C2]" : "text-gray-500"}`}
              >
                Contacts
              </span>
            </a>
            <a href="/scan" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full bg-[#0A66C2] flex items-center justify-center -mt-5 shadow-lg shadow-[#0A66C2]/30">
                <span className="text-xl">📷</span>
              </div>
              <span className="text-xs font-bold text-[#0A66C2]">Scan</span>
            </a>
            <a href="/groups" className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${pathname === "/groups" ? "bg-[#E8F4FD]" : ""}`}
              >
                <span className="text-xl">👥</span>
              </div>
              <span
                className={`text-xs font-semibold ${pathname === "/groups" ? "text-[#0A66C2]" : "text-gray-500"}`}
              >
                Groups
              </span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
