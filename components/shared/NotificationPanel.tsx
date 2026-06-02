  "use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FiSettings } from "react-icons/fi";
import Bellicon from "../icons/sidebar/Bellicon";

const ANIMATION_DURATION_MS = 220;

const notificationItems = [
  {
    id: "new-customer",
    titleKey: "items.newCustomer.title",
    bodyKey: "items.newCustomer.body",
    timeKey: "items.newCustomer.time",
  },
  {
    id: "kyc-submission",
    titleKey: "items.kycSubmission.title",
    bodyKey: "items.kycSubmission.body",
    timeKey: "items.kycSubmission.time",
  },
  {
    id: "transaction-success",
    titleKey: "items.transactionSuccess.title",
    bodyKey: "items.transactionSuccess.body",
    timeKey: "items.transactionSuccess.time",
  },
  {
    id: "transaction-failed",
    titleKey: "items.transactionFailed.title",
    bodyKey: "items.transactionFailed.body",
    timeKey: "items.transactionFailed.time",
  },
] as const;

export default function NotificationPanel() {
  const t = useTranslations("Dashboard.notifications");
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender]);

  const togglePanel = () => {
    if (!isOpen) {
      setShouldRender(true);
    }

    setIsOpen((current) => !current);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={isOpen ? t("closeAriaLabel") : t("openAriaLabel")}
        aria-expanded={isOpen}
        onClick={togglePanel}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-white transition-all duration-200 ${
          isOpen
            ? "border-[#4A4D53] bg-[#2B2D31]"
            : "border-[#373A40] bg-[#2c2e33] hover:bg-[#34373D]"
        }`}
      >
        <Bellicon />
      </button>

      {shouldRender ? (
        <div
          className={`fixed inset-x-3 top-19 z-40 max-h-[calc(100vh-92px)] origin-top flex flex-col rounded-[18px] border border-[#373A40] bg-[#1F1F1F] shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ease-out sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-106 sm:max-h-[min(75vh,720px)] sm:origin-top-right ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#31343A] px-5 py-4">
            <p className="text-lg font-medium leading-none text-white">
              {t("title")}
            </p>
            <button
              type="button"
              aria-label={t("settingsAriaLabel")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#F3F4F6] transition hover:bg-white/6"
            >
              <FiSettings className="text-lg" />
            </button>
          </div>

          <div className="px-5 py-3 flex-1 overflow-y-auto custom-scroll">
            {notificationItems.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {t(item.titleKey)}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#D5D7DB]">
                      {t(item.bodyKey)}{" "}
                      <button
                        type="button"
                        className="text-[#FFB339] underline underline-offset-2"
                      >
                        {t("view")}
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-[#E9EAED]">
                      {t(item.timeKey)}
                    </p>
                  </div>
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFB339]" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-3 border-t border-[#31343A] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <button
              type="button"
              className="text-left text-sm font-medium text-[#FFB339] transition-opacity hover:opacity-80"
            >
              {t("markAllRead")}
            </button>
            <button
              type="button"
              className="w-full rounded-xl bg-[#FFB339] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#ffc055] sm:w-auto"
            >
              {t("viewAll")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
