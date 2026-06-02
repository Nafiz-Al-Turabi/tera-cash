 "use client";

import Image from "next/image";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import NotificationPanel from "./NotificationPanel";

type DashboardHeaderProps = {
  onOpenSidebar: () => void;
};

export default function DashboardHeader({
  onOpenSidebar,
}: DashboardHeaderProps) {
  const t = useTranslations("Dashboard");

  return (
    <header className="sticky top-0 z-20  sm:px-6 py-2 lg:py-4 bg-[#050505] px-4">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 ">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            onClick={onOpenSidebar}
            aria-label={t("openSidebar")}
          >
            <FiMenu size={18} />
          </button>
          <div className="relative">
            <input
              placeholder={t("searchPlaceholder")}
              type="text"
              aria-label={t("searchAriaLabel")}
              className="border border-[#2c2e33] outline-none focus:border-[#FFB339] pl-10 pr-4 py-1.5 lg:py-3.75 rounded-md w-full lg:w-lg duration-300"
            />
            <CiSearch className="text-2xl absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-3">
          <LocaleSwitcher />
          <NotificationPanel />
          <div>
            <Image
              src="/profile.jpg"
              alt={t("userAvatarAlt")}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
