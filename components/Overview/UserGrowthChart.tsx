"use client";

import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { useLocale, useTranslations } from "next-intl";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const chartValues = [112, 178, 200, 146,800, 226, 192, 204, 160, 366, 292, 334, 242,500];
const tooltipWidth = 156;
const tooltipHeight = 84;
const yAxisTickCount = 5;

type HoveredPoint = {
  dataPointIndex: number;
  left: number;
  top: number;
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33325 1.33337V4.00004"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 1.33337V4.00004"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.27332H14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.33325 8.82861C1.33325 5.81414 1.33325 4.30691 2.26999 3.37018C3.20673 2.43344 4.71396 2.43344 7.72843 2.43344H8.27158C11.286 2.43344 12.7933 2.43344 13.73 3.37018C14.6667 4.30691 14.6667 5.81414 14.6667 8.82861V9.03828C14.6667 12.0527 14.6667 13.56 13.73 14.4967C12.7933 15.4334 11.286 15.4334 8.27158 15.4334H7.72843C4.71396 15.4334 3.20673 15.4334 2.26999 14.4967C1.33325 13.56 1.33325 12.0527 1.33325 9.03828V8.82861Z"
        stroke="currentColor"
      />
      <path
        d="M5.33057 9.33337H5.33656"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.99756 9.33337H8.00355"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.6631 9.33337H10.6691"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function getNiceAxisStep(maxValue: number, tickCount: number) {
  const rawStep = maxValue / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep || 1));
  const normalizedStep = rawStep / magnitude;

  if (normalizedStep <= 1) {
    return magnitude;
  }

  if (normalizedStep <= 2) {
    return 2 * magnitude;
  }

  if (normalizedStep <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

export default function UserGrowthChart() {
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const [displayPoint, setDisplayPoint] = useState<HoveredPoint | null>(null);
  const locale = useLocale();
  const t = useTranslations("Dashboard.overview");

  const monthLabels = [
    t("userGrowthChart.months.jan"),
    t("userGrowthChart.months.feb"),
    t("userGrowthChart.months.mar"),
    t("userGrowthChart.months.apr"),
    t("userGrowthChart.months.may"),
    t("userGrowthChart.months.jun"),
    t("userGrowthChart.months.jul"),
    t("userGrowthChart.months.aug"),
    t("userGrowthChart.months.sep"),
    t("userGrowthChart.months.oct"),
    t("userGrowthChart.months.nov"),
    t("userGrowthChart.months.dec"),
  ];

  const pointDates = monthLabels.map((_, index) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2025, index, 13))),
  );

  const dataMax = Math.max(...chartValues);
  const yAxisStep = getNiceAxisStep(dataMax, yAxisTickCount);
  const yAxisMax = yAxisStep * yAxisTickCount;

  const handleChartMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const wrapper = chartWrapperRef.current;
    const grid = wrapper?.querySelector(".apexcharts-grid");

    if (!wrapper || !grid) {
      setHoveredPoint(null);
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const isInsideGrid =
      event.clientX >= gridRect.left &&
      event.clientX <= gridRect.right &&
      event.clientY >= gridRect.top &&
      event.clientY <= gridRect.bottom;

    if (!isInsideGrid) {
      setHoveredPoint(null);
      return;
    }

    const relativeX = event.clientX - gridRect.left;
    const step = gridRect.width / Math.max(chartValues.length - 1, 1);
    const dataPointIndex = Math.max(
      0,
      Math.min(chartValues.length - 1, Math.round(relativeX / step)),
    );

    const pointX = step * dataPointIndex;
    const pointY =
      gridRect.height - (chartValues[dataPointIndex] / yAxisMax) * gridRect.height;

    const rawLeft = gridRect.left - wrapperRect.left + pointX;
    const rawTop = gridRect.top - wrapperRect.top + pointY;
    const left = Math.max(
      12,
      Math.min(rawLeft - tooltipWidth / 2, wrapperRect.width - tooltipWidth - 12),
    );
    const top = Math.max(8, rawTop - tooltipHeight - 14);
    const nextHoveredPoint = {
      dataPointIndex,
      left,
      top,
    };

    setHoveredPoint((current) => {
      if (
        current?.dataPointIndex === nextHoveredPoint.dataPointIndex &&
        current.left === nextHoveredPoint.left &&
        current.top === nextHoveredPoint.top
      ) {
        return current;
      }

      return nextHoveredPoint;
    });
    setDisplayPoint(nextHoveredPoint);
  };

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: "#B4B4B7",
      fontFamily: "Inter, sans-serif",
      sparkline: { enabled: false },
      parentHeightOffset: 0,
    },
    colors: ["#FFB339"],
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.2,
        stops: [1],
      },
    },
    grid: {
      borderColor: "#31343A",
      strokeDashArray: 0,
      padding: {
        left: 8,
        right: 14,
        top: 6,
        bottom: 0,
      },
    },
    legend: { show: false },
    markers: {
      size: 0,
      colors: "#171717",
      strokeColors: "#E4E4E7",
      strokeWidth: 2,
      fillOpacity: 1,
      discrete: hoveredPoint
        ? [
            {
              seriesIndex: 0,
              dataPointIndex: hoveredPoint.dataPointIndex,
              size: 7,
              fillColor: "#171717",
              strokeColor: "#E4E4E7",
            },
          ]
        : [],
      hover: {
        sizeOffset: 0,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            offsetY: 8,
          },
          grid: {
            padding: {
              left: 0,
              right: 4,
            },
          },
          yaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      curve: "smooth",
      lineCap: "round",
      width: 2,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        color: "#42454C",
      },
      axisTicks: {
        color: "#42454C",
      },
      categories: monthLabels,
      crosshairs: {
        show: false,
      },
      labels: {
        offsetY: 4,
        style: {
          colors: "#B4B4B7",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      min: 0,
      max: yAxisMax,
      tickAmount: yAxisTickCount,
      labels: {
        formatter(value) {
          return value === 0 ? "" : `${Math.round(value)}`;
        },
        offsetX: -6,
        style: {
          colors: "#B4B4B7",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 400,
        },
      },
    },
  };

  const series = [
    {
      name: t("userGrowthChart.newSignups"),
      data: chartValues,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#383A3F] bg-[#101010] p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="manrope-font text-base leading-[132%] text-white">
            {t("userGrowthChart.title")}
          </p>
          <p className="mt-1 text-[2rem] font-semibold leading-none text-white">
            {t("userGrowthChart.change")}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#383A3F] bg-[#161616] px-3 py-2 text-xs text-[#E4E4E7]"
        >
          <span>{t("userGrowthChart.monthly")}</span>
          <CalendarIcon />
        </button>
      </div>

      <div className="relative">
        <div
          className="relative h-75 sm:h-85"
          onMouseLeave={() => setHoveredPoint(null)}
          onMouseMove={handleChartMouseMove}
          ref={chartWrapperRef}
        >
          {displayPoint ? (
            <div
              className={`pointer-events-none absolute z-30 min-w-39 rounded-xl bg-[#343434] px-3 py-3 shadow-[0_18px_32px_rgba(0,0,0,0.35)] transition-[left,top,opacity,transform] duration-200 ease-out will-change-[left,top,opacity,transform] ${
                hoveredPoint
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-2 scale-95 opacity-0"
              }`}
              style={{
                left: displayPoint.left,
                top: displayPoint.top,
              }}
            >
              <p className="manrope-font text-sm text-white">
                {t("userGrowthChart.newSignups")}
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-[#E4E4E7]">
                  {pointDates[displayPoint.dataPointIndex]}
                </span>
                <span className="text-lg font-bold leading-none text-[#FFB339]">
                  {chartValues[displayPoint.dataPointIndex]}
                </span>
              </div>
            </div>
          ) : null}
          <Chart
            height="100%"
            options={options}
            series={series}
            type="area"
            width="100%"
          />
        </div>
      </div>
    </section>
  );
}
