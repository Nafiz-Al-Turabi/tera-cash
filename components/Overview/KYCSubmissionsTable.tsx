"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import ReusableTable from "../Reusable/ReusableTable";
import ReusableSelect from "../Reusable/ReusableSelect";

type KycStatus = "approved" | "rejected" | "pending";
type KycCountry = "france";
type KycDocument = "passport" | "idCard";

type KycSubmission = {
  id: number;
  no: string;
  name: string;
  email: string;
  phone: string;
  country: KycCountry;
  document: KycDocument;
  date: Date;
  status: KycStatus;
};

const statusFilterOptions = [
  { value: "all", labelKey: "filters.statusOptions.all" },
  { value: "approved", labelKey: "filters.statusOptions.approved" },
  { value: "rejected", labelKey: "filters.statusOptions.rejected" },
  { value: "pending", labelKey: "filters.statusOptions.pending" },
] as const;

const sortOptions = [
  { value: "date-desc", labelKey: "filters.sortOptions.newest" },
  { value: "date-asc", labelKey: "filters.sortOptions.oldest" },
  { value: "name-asc", labelKey: "filters.sortOptions.nameAsc" },
  { value: "name-desc", labelKey: "filters.sortOptions.nameDesc" },
] as const;

const data: KycSubmission[] = [
  {
    id: 1,
    no: "01",
    name: "Sadia Liza",
    email: "yourmail@gmail.com",
    phone: "+221 70 123 45 67",
    country: "france",
    document: "passport",
    date: new Date(Date.UTC(2025, 0, 15, 16, 30)),
    status: "approved",
  },
  {
    id: 2,
    no: "02",
    name: "Afrin",
    email: "yourmail@gmail.com",
    phone: "+221 70 123 45 67",
    country: "france",
    document: "idCard",
    date: new Date(Date.UTC(2025, 0, 15, 16, 30)),
    status: "rejected",
  },
  {
    id: 3,
    no: "03",
    name: "Edward",
    email: "yourmail@gmail.com",
    phone: "+221 70 123 45 67",
    country: "france",
    document: "passport",
    date: new Date(Date.UTC(2025, 0, 15, 16, 30)),
    status: "approved",
  },
  {
    id: 4,
    no: "04",
    name: "Jenny",
    email: "yourmail@gmail.com",
    phone: "+221 70 123 45 67",
    country: "france",
    document: "idCard",
    date: new Date(Date.UTC(2025, 0, 15, 16, 30)),
    status: "pending",
  },
  {
    id: 5,
    no: "05",
    name: "Anna",
    email: "yourmail@gmail.com",
    phone: "+221 70 123 45 67",
    country: "france",
    document: "passport",
    date: new Date(Date.UTC(2025, 0, 15, 16, 30)),
    status: "approved",
  },
];

const statusClasses: Record<KycStatus, string> = {
  approved: "border-[#12B347] bg-[#0E2415] text-[#2CE05F]",
  rejected: "border-[#EF4444] bg-[#2C1414] text-[#FF6363]",
  pending: "border-[#D4A017] bg-[#2F2712] text-[#FFCB45]",
};

export default function KYCSubmissionsTable() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.overview.kycSubmissionsTable");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");

  const columns = [
    {
      label: t("columns.no"),
      key: "no",
      headerClassName: "w-[72px]",
      cellClassName: "text-[#F8F8F8]",
    },
    { label: t("columns.name"), key: "name", headerClassName: "min-w-[150px]" },
    {
      label: t("columns.email"),
      key: "email",
      headerClassName: "min-w-[170px]",
      cellClassName: "text-[#D5D5D5]",
    },
    {
      label: t("columns.phone"),
      key: "phone",
      headerClassName: "min-w-[130px]",
      cellClassName: "text-[#D5D5D5]",
    },
    {
      label: t("columns.country"),
      key: "country",
      headerClassName: "min-w-[115px]",
    },
    {
      label: t("columns.document"),
      key: "document",
      headerClassName: "min-w-[100px]",
    },
    { label: t("columns.date"), key: "date", headerClassName: "min-w-[128px]" },
    {
      label: t("columns.status"),
      key: "status",
      headerClassName: "min-w-[110px]",
    },
    {
      label: t("columns.action"),
      key: "action",
      headerClassName: "w-[84px] text-center",
      cellClassName: "text-center",
    },
  ];

  const formatDate = (value: Date) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: locale.startsWith("en"),
      timeZone: "UTC",
    }).format(value);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredData = data
    .filter((submission) => {
      const matchesSearch =
        normalizedSearchTerm === "" ||
        submission.name.toLowerCase().includes(normalizedSearchTerm);
      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((left, right) => {
      switch (sortBy) {
        case "date-desc":
          return right.date.getTime() - left.date.getTime();
        case "date-asc":
          return left.date.getTime() - right.date.getTime();
        case "name-asc":
          return left.name.localeCompare(right.name);
        case "name-desc":
          return right.name.localeCompare(left.name);
        default:
          return 0;
      }
    });

  return (
    <section className="overflow-hidden rounded-xl border border-[#2A2C31] bg-[#1B1B1B] px-4 py-4 sm:px-5">
      <div className="">
        <h2 className="text-[22px] font-semibold leading-none text-[#C7C9CE] mb-4">
          {t("title")}
        </h2>
      </div>

      <div className="">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-57">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label={t("filters.searchAriaLabel")}
              placeholder={t("filters.searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-[#34373D] bg-transparent pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#9A9EA6] focus:border-[#FFB339]"
            />
            <CiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#A0A4AE]" />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            <div className="w-full sm:max-w-42.5">
              <ReusableSelect
                placeholder={t("filters.statusPlaceholder")}
                options={statusFilterOptions.map((option) => ({
                  label: t(option.labelKey),
                  value: option.value,
                }))}
                value={statusFilter}
                onChange={setStatusFilter}
                classNames={{
                  trigger:
                    "h-10 rounded-lg border-[#34373D] bg-[#2B2B2E] px-4 py-0 text-[#E6E7EA] hover:border-[#4B4E56]",
                  menu:
                    "rounded-lg border-[#34373D] bg-[#222326]",
                  option: "px-4 py-2.5",
                }}
              />
            </div>
            <div className="w-full sm:max-w-42.5">
              <ReusableSelect
                placeholder={t("filters.sortPlaceholder")}
                options={sortOptions.map((option) => ({
                  label: t(option.labelKey),
                  value: option.value,
                }))}
                value={sortBy}
                onChange={setSortBy}
                classNames={{
                  trigger:
                    "h-10 rounded-lg border-[#34373D] bg-[#2B2B2E] px-4 py-0 text-[#E6E7EA] hover:border-[#4B4E56]",
                  menu:
                    "rounded-lg border-[#34373D] bg-[#222326]",
                  option: "px-4 py-2.5",
                }}
              />
            </div>
          </div>
        </div>

        <ReusableTable
          columns={columns}
          data={filteredData}
          containerClassName="shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          emptyMessage={t("emptyMessage")}
          renderCell={(row, value, col) => {
            if (col.key === "country") {
              return t(`countries.${String(value)}`);
            }

            if (col.key === "document") {
              return (
                <button
                  type="button"
                  className="cursor-pointer text-[#F4B84A] underline decoration-[#F4B84A]/70 underline-offset-2"
                >
                  {t(`documents.${String(value)}`)}
                </button>
              );
            }

            if (col.key === "date" && value instanceof Date) {
              return formatDate(value);
            }

            if (col.key === "status") {
              const status = value as KycStatus;
              return (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[status]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {t(`statuses.${status}`)}
                </span>
              );
            }

            if (col.key === "action") {
              const submission = row as KycSubmission;
              return (
                <button
                  type="button"
                  aria-label={t("viewUser", { name: submission.name })}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#F0F0F0] transition hover:bg-white/6"
                >
                  <FiEye className="text-base" />
                </button>
              );
            }

            return typeof value === "string" ? value : String(value ?? "-");
          }}
        />
      </div>
    </section>
  );
}
