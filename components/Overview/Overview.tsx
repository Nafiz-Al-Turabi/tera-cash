import React from "react";
import { useTranslations } from "next-intl";
import { FaUser } from "react-icons/fa";
import ArrowUpIcon from "../icons/ArrowUpIcon";
import ProgressIcon from "../icons/ProgressIcon";
import UserGrowthChart from "./UserGrowthChart";
import WalletIcon from "../icons/WalletIcon";
import KYCSubmissionsTable from "./KYCSubmissionsTable";

type CardItem = {
  id: string;
  title: string;
  value: string;
  Icon?: React.ElementType;
  change: string;
  changeText: string;
  ChangeIcon?: React.ElementType;
};

const data: CardItem[] = [
  {
    id: "users",
    title: "totalActiveUsers",
    value: "277",
    Icon: FaUser,
    change: "+4%",
    changeText: "vsLastMonth",
    ChangeIcon: ArrowUpIcon,
  },
  {
    id: "tx",
    title: "totalTransactions",
    value: "$ 255.84",
    Icon: ProgressIcon,
    change: "+0.3",
    changeText: "vsLastMonth",
    ChangeIcon: ArrowUpIcon,
  },
  {
    id: "rate",
    title: "successRate",
    value: "80%",
    Icon: WalletIcon,
    change: "+9%",
    changeText: "vsLastMonth",
    ChangeIcon: ArrowUpIcon,
  },
];

export default function Overview() {
  const t = useTranslations("Dashboard.overview");
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => {
          const Icon = item.Icon;
          const ChangeIcon = item.ChangeIcon;
          return (
            <div
              key={item.id}
              className="border border-[#383A3F] p-4 rounded-xl bg-[#1b1b1b] "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs  leading-[132%] manrope-font mb-1">
                      {t(item.title)}
                  </p>
                  <h1 className="text-xl font-bold text-white manrope-font">
                    {item.value}
                  </h1>
                </div>
                <div className="text-base text-[#FFB339] bg-[#3A2E1F] p-1.5 rounded-[2.25px]">
                  {Icon ? <Icon /> : null}
                </div>
              </div>
              <p className="text-[10px] leading-[132%] manrope-font mt-4 flex items-center gap-1">
                {ChangeIcon ? (
                  <ChangeIcon className="text-[#36B22F] mr-1" />
                ) : null}
                {item.change} {t(item.changeText)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <UserGrowthChart />
      </div>
      <div className="mt-6">
        <KYCSubmissionsTable />
      </div>
    </div>
  );
}
