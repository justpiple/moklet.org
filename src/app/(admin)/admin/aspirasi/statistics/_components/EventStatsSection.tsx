import React from "react";
import { H3, P } from "@/app/_components/global/Text";
import { stringifyDate } from "@/utils/atomics";

type EventStatsProps = {
  eventStats: {
    id: string;
    name: string;
    date: Date;
    count: number;
  }[];
};

export default function EventStatsSection({
  eventStats,
}: Readonly<EventStatsProps>) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <H3 className="mb-4">Statistik Event</H3>
      <P className="text-gray-500 mb-2">Data dari 2 tahun terakhir</P>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Nama Event</th>
              <th className="py-2 px-4 text-left">Tanggal</th>
              <th className="py-2 px-4 text-right">Jumlah Aspirasi</th>
            </tr>
          </thead>
          <tbody>
            {eventStats.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  Tidak ada data event
                </td>
              </tr>
            ) : (
              eventStats.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{event.name}</td>
                  <td className="py-2 px-4">
                    {stringifyDate(new Date(event.date))}
                  </td>
                  <td className="py-2 px-4 text-right">{event.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
