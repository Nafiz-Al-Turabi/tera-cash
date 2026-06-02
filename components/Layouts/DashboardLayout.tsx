"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import HomeIcon from "../icons/sidebar/HomeIcon";
import Image from "next/image";
import UsersIcon from "../icons/sidebar/UsersIcon";
import KycIcon from "../icons/sidebar/KycIcon";
import DollerIcon from "../icons/sidebar/DollerIcon";
import SettingsIcon from "../icons/sidebar/SettingsIcon";
import VerifyIcon from "../icons/sidebar/VerifyIcon";
import DashboardHeader from "../shared/DashboardHeader";

const navItems = [
  { key: "dashboard", href: "/", icon: HomeIcon },
  { key: "users", href: "/users", icon: UsersIcon },
  { key: "kycSubmissions", href: "/kyc-submissions", icon: KycIcon },
  { key: "transactions", href: "/transactions", icon: DollerIcon },
  { key: "settings", href: "/settings", icon: SettingsIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActivePath = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen">
      {sidebarOpen && (
        <button
          type="button"
          aria-label={t("closeSidebarOverlay")}
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:left-4 inset-y-0 z-40 flex w-60 flex-col bg-[#1b1b1b] p-5 transition-transform duration-300 lg:top-4 lg:h-[96.5%] lg:translate-x-0 lg:rounded-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex justify-center w-full">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt={t("logoAlt")}
                width={160}
                height={40}
                className="w-full "
              />
            </Link>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("closeSidebar")}
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex h-full flex-col">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = isActivePath(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#FFB339] text-black"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#050505]"
                  }`}
                >
                  <Icon />
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-[#353535] bg-[#1f1f1f] px-3 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] cursor-pointer hover:bg-[#2c2e33] duration-300 transition">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <Image
                    src="/profile.jpg"
                    alt="Edwin T."
                    fill
                    sizes="48px"
                    className="rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-[#1f1f1f] bg-[#2fd66a]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-[#f3f3f3]">
                      Edwin T.
                    </p>
                    <VerifyIcon />
                  </div>
                  <p className="truncate text-xs text-[#8f8f8f]">
                    edwin@gmail.com
                  </p>
                </div>

                <FiChevronRight className="shrink-0 text-2xl text-[#7a7a7a]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 lg:pt-0">
        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full  p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
