import React from "react";

import { H2, H3, P } from "@/app/_components/global/Text";
import StatsCard from "./_components/StatsCard";
import FilterSection from "./_components/FilterSection";
import EventStatsSection from "./_components/EventStatsSection";
import OrganizationStatsSection from "./_components/OrganizationStatsSection";
import SchoolUnitStatsSection from "./_components/SchoolUnitStatsSection";
import MonthlyTrendChart from "./_components/MonthlyTrendChart";
import StatisticsDistributionChart from "./_components/StatisticsDistributionChart";
import { getAspirasiStats } from "@/actions/statsAspirasi";

export default async function StatisticsPage({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const dateRange = searchParams.dateRange as string | undefined;
  const fromDate = searchParams.fromDate as string | undefined;
  const toDate = searchParams.toDate as string | undefined;
  const category = searchParams.category as string | undefined;
  const organization = searchParams.organization?.toString().toUpperCase();
  const schoolUnit = searchParams.schoolUnit?.toString().toUpperCase();

  const stats = await getAspirasiStats({
    dateRange,
    fromDate,
    toDate,
    category,
    organization,
    schoolUnit,
  });

  const distributionData = [
    { name: "Event", value: stats.totalEventAspirasi },
    { name: "Organisasi", value: stats.totalOrgAspirasi },
    { name: "Unit Sekolah", value: stats.totalUnitAspirasi },
  ];

  const trendData = stats.monthlyData.map((item) => ({
    month: item.month,
    count: item.count,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <H2>Statistik Aspirasi</H2>
        <P className="text-gray-600 mt-2 md:mt-0">
          Data statistik aspirasi kategori
        </P>
      </div>

      <FilterSection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Aspirasi"
          value={stats.totalAspirasi}
          icon="total"
        />
        <StatsCard
          title="Aspirasi Event"
          value={stats.totalEventAspirasi}
          icon="event"
        />
        <StatsCard
          title="Aspirasi Organisasi"
          value={stats.totalOrgAspirasi}
          icon="organization"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <H3 className="mb-4">Bar chart Aspirasi</H3>
          <MonthlyTrendChart data={trendData} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <H3 className="mb-4">Distribusi Aspirasi</H3>
          <StatisticsDistributionChart data={distributionData} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <EventStatsSection eventStats={stats.eventStats} />
        <div className="grid grid-cols-1 gap-6">
          <OrganizationStatsSection orgStats={stats.orgStats} />
          <SchoolUnitStatsSection unitStats={stats.unitStats} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <div className="flex items-center justify-between mb-4">
          <H3>Ringkasan Statistik</H3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <P className="font-medium mb-2">Event Teratas</P>
            {stats.eventStats.length > 0 ? (
              <P>
                {stats.eventStats[0].name} adalah event dengan aspirasi
                terbanyak ({stats.eventStats[0].count} aspirasi).
              </P>
            ) : (
              <P className="text-gray-500">Tidak ada data</P>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <P className="font-medium mb-2">Organisasi Teratas</P>
            {stats.orgStats.length > 0 ? (
              <P>
                {stats.orgStats.toSorted((a, b) => b.count - a.count)[0].name}{" "}
                adalah organisasi dengan aspirasi terbanyak (
                {stats.orgStats.toSorted((a, b) => b.count - a.count)[0].count}{" "}
                aspirasi).
              </P>
            ) : (
              <P className="text-gray-500">Tidak ada data</P>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <P className="font-medium mb-2">Unit Sekolah Teratas</P>
            {stats.unitStats.length > 0 ? (
              <P>
                {stats.unitStats.toSorted((a, b) => b.count - a.count)[0].name}{" "}
                adalah unit sekolah dengan aspirasi terbanyak (
                {stats.unitStats.toSorted((a, b) => b.count - a.count)[0].count}{" "}
                aspirasi).
              </P>
            ) : (
              <P className="text-gray-500">Tidak ada data</P>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
