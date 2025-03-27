import React from "react";
import { FaChartLine, FaCalendarAlt, FaSitemap } from "react-icons/fa";
import { H3, P } from "@/app/_components/global/Text";

type StatsCardProps = {
  title: string;
  value: number;
  icon: "total" | "event" | "organization" | "school";
};

export default function StatsCard({
  title,
  value,
  icon,
}: Readonly<StatsCardProps>) {
  const getIcon = () => {
    switch (icon) {
      case "total":
        return <FaChartLine className="text-blue-500" size={24} />;
      case "event":
        return <FaCalendarAlt className="text-green-500" size={24} />;
      case "organization":
        return <FaSitemap className="text-purple-500" size={24} />;
      case "school":
        return <FaSitemap className="text-orange-500" size={24} />;
      default:
        return <FaChartLine className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <P className="text-gray-500">{title}</P>
        {getIcon()}
      </div>
      <H3 className="text-2xl font-bold">{value.toLocaleString()}</H3>
    </div>
  );
}
