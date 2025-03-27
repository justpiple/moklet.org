"use server";

import { Organisasi_Type, UnitSekolah } from "@prisma/client";
import prisma from "@/lib/prisma";

type FilterParams = {
  dateRange?: string;
  fromDate?: string;
  toDate?: string;
  category?: string;
  organization?: string;
  schoolUnit?: string;
};

export async function getAspirasiStats(filters: FilterParams = {}) {
  const {
    dateRange = "last6Months",
    fromDate,
    toDate,
    category = "all",
    organization = "all",
    schoolUnit = "all",
  } = filters;

  let startDate = new Date();
  const endDate = new Date();

  if (fromDate && toDate && dateRange === "custom") {
    startDate = new Date(fromDate);
    endDate.setHours(23, 59, 59, 999);
    endDate.setTime(new Date(toDate).getTime());
  } else {
    switch (dateRange) {
      case "last1Month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "last3Months":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "last6Months":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "last1Year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "last2Years":
      default:
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;
    }
  }

  const baseWhereClause = {
    created_at: {
      gte: startDate,
      lte: endDate,
    },
  };

  const whereClause: any = { ...baseWhereClause };

  if (category === "event") {
    whereClause.event_id = { not: null };
  } else if (category === "organization") {
    whereClause.organisasi = { not: null };
    if (organization !== "all") {
      whereClause.organisasi = organization as Organisasi_Type;
    }
  } else if (category === "schoolUnit") {
    whereClause.unit_sekolah = { not: null };
    if (schoolUnit !== "all") {
      whereClause.unit_sekolah = schoolUnit as UnitSekolah;
    }
  } else {
    if (organization !== "all") {
      whereClause.organisasi = organization as Organisasi_Type;
    }
    if (schoolUnit !== "all") {
      whereClause.unit_sekolah = schoolUnit as UnitSekolah;
    }
  }

  const totalAspirasi = await prisma.aspirasi.count({
    where: whereClause,
  });

  const eventWhereClause = {
    ...whereClause,
    event_id: { not: null },
  };
  delete eventWhereClause.organisasi;
  delete eventWhereClause.unit_sekolah;

  const totalEventAspirasi = await prisma.aspirasi.count({
    where: eventWhereClause,
  });

  const orgWhereClause = {
    ...whereClause,
    organisasi: { not: null },
  };
  delete orgWhereClause.event_id;
  delete orgWhereClause.unit_sekolah;

  if (organization !== "all") {
    orgWhereClause.organisasi = organization as Organisasi_Type;
  }

  const totalOrgAspirasi = await prisma.aspirasi.count({
    where: orgWhereClause,
  });

  const unitWhereClause = {
    ...whereClause,
    unit_sekolah: { not: null },
  };
  delete unitWhereClause.event_id;
  delete unitWhereClause.organisasi;

  if (schoolUnit !== "all") {
    unitWhereClause.unit_sekolah = schoolUnit as UnitSekolah;
  }

  const totalUnitAspirasi = await prisma.aspirasi.count({
    where: unitWhereClause,
  });

  const eventDateStart = new Date(startDate);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: eventDateStart,
        lte: endDate,
      },
    },
    include: {
      _count: {
        select: {
          aspirasi: {
            where: whereClause,
          },
        },
      },
    },
    orderBy: [{ date: "desc" }],
  });

  const eventStats = events.map((event) => ({
    id: event.id,
    name: event.event_name,
    date: event.date,
    count: event._count.aspirasi,
  }));

  const orgStats = await Promise.all(
    Object.values(Organisasi_Type).map(async (org) => {
      const count = await prisma.aspirasi.count({
        where: {
          ...baseWhereClause,
          organisasi: org,
        },
      });

      return {
        name: org,
        count,
      };
    }),
  );

  const unitStats = await Promise.all(
    Object.values(UnitSekolah).map(async (unit) => {
      const count = await prisma.aspirasi.count({
        where: {
          ...baseWhereClause,
          unit_sekolah: unit,
        },
      });

      return {
        name: unit,
        count,
      };
    }),
  );

  const monthlyTrends = await getMonthlyTrends(startDate, endDate, whereClause);

  return {
    totalAspirasi,
    totalEventAspirasi,
    totalOrgAspirasi,
    totalUnitAspirasi,
    eventStats,
    orgStats,
    unitStats,
    monthlyData: monthlyTrends,
  };
}

async function getMonthlyTrends(
  startDate: Date,
  endDate: Date,
  whereClause: any,
) {
  const monthDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();
  const numMonths = Math.min(Math.max(monthDiff, 1), 12);

  const monthlyData = Array.from({ length: numMonths }, (_, i) => {
    const month = new Date(endDate);
    month.setMonth(endDate.getMonth() - (numMonths - 1) + i);
    return {
      month: month.toLocaleString("id-ID", { month: "short", year: "numeric" }),
      monthStart: new Date(month.getFullYear(), month.getMonth(), 1),
      monthEnd: new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ),
      count: 0,
    };
  });

  for (const element of monthlyData) {
    const { monthStart, monthEnd } = element;

    const count = await prisma.aspirasi.count({
      where: {
        ...whereClause,
        created_at: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    element.count = count;
  }

  return monthlyData.map(({ month, count }) => ({ month, count }));
}
