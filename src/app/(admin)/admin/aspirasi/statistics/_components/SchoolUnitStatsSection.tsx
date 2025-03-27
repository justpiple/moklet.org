import React from "react";
import { H3 } from "@/app/_components/global/Text";

type SchoolUnitStatsProps = {
  unitStats: {
    name: string;
    count: number;
  }[];
};

export default function SchoolUnitStatsSection({
  unitStats,
}: Readonly<SchoolUnitStatsProps>) {
  const sortedStats = [...unitStats].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <H3 className="mb-4">Statistik Unit Sekolah</H3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Unit Sekolah</th>
              <th className="py-2 px-4 text-right">Jumlah Aspirasi</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-center text-gray-500">
                  Tidak ada data unit sekolah
                </td>
              </tr>
            ) : (
              sortedStats.map((unit) => (
                <tr key={unit.name} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{unit.name}</td>
                  <td className="py-2 px-4 text-right">{unit.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
