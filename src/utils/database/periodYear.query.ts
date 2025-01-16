import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

export const findLatestPeriod = async (isActive?: boolean) => {
  let latestPeriodYear = await prisma.period_Year.findMany({});

  latestPeriodYear.sort((a, b) => {
    return parseInt(b.period.split("/")[0]) - parseInt(a.period.split("/")[0]);
  });

  if (isActive != undefined) {
    latestPeriodYear = latestPeriodYear.filter(
      (period) => period.is_active == isActive,
    );
  }

  return latestPeriodYear[0];
};

export const findPeriodsThatHaveOrganisasi = async () => {
  return await prisma.period_Year.findMany({
    where: {
      organisasis: {
        some: {},
      },
    },
  });
};

export const findAllPeriods = async (filter?: Prisma.Period_YearWhereInput) => {
  return await prisma.period_Year.findMany({
    where: filter,
  });
};

export const findAllPeriodsWithOrganisasi = async (
  filter?: Prisma.Period_YearWhereInput,
) => {
  return await prisma.period_Year.findMany({
    where: filter,
    include: { organisasis: { select: { organisasi: true, id: true } } },
  });
};

export const findPeriod = async (filter: Prisma.Period_YearWhereInput) => {
  return await prisma.period_Year.findFirst({
    where: filter,
    include: { organisasis: true },
  });
};

export const findPeriodWithoutOrganisasi = async (
  filter: Prisma.Period_YearWhereInput,
) => {
  return await prisma.period_Year.findFirst({
    where: filter,
  });
};

export const createPeriod = async (
  data: Prisma.Period_YearUncheckedCreateInput,
) => {
  return await prisma.period_Year.create({ data });
};

export const updatePeriod = async (
  where: Prisma.Period_YearWhereUniqueInput,
  update: Prisma.Period_YearUncheckedUpdateInput,
) => {
  return await prisma.period_Year.update({ where, data: update });
};

export const deletePeriod = async (id: string) => {
  return await prisma.period_Year.delete({ where: { id } });
};
