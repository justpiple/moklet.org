"use client";
import { Sidebar } from "./components/Sidebar";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const [nav, setNav] = useState(false);
  const pathname = usePathname().split("/");
  pathname.shift();
  return (
    <main className="flex w-full h-screen overflow-hidden bg-slate-100">
      <Sidebar nav={nav} session={session} />
      <div
        id="main-content"
        className="relative h-full w-full overflow-y-auto ps-10 md:ps-24 py-4 lg:ml-64"
      >
        <nav className="w-max rounded-lg bg-gray-200 p-2 font-sans text-sm capitalize md:p-3">
          <ol className="flex">
            <li>
              <Link href="/" className="font-bold text-primary-400">
                home
              </Link>
            </li>
            {pathname.map((path, i) => {
              const last = i + 1 == pathname.length;
              return (
                <React.Fragment key={i}>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li>
                    <Link
                      className={`${last ? "" : "text-primary-400"} font-bold`}
                      href={"/" + pathname.slice(0, i + 1).join("/")}
                      key={i}
                    >
                      {path.replace(/-/g, " ").trim()}
                    </Link>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
        <main>
          <div className="md:px-4 pe-10 pt-6">{children}</div>
        </main>
      </div>
    </main>
  );
}
