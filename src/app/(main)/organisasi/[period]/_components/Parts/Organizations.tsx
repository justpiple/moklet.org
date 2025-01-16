import { ReactElement } from "react";
import { FaGlobe } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

import { OrganizationWithPeriod } from "@/types/entityRelations";
import { findPeriodsThatHaveOrganisasi } from "@/utils/database/periodYear.query";
import { Organisasi } from "@prisma/client";
import OrganizationSection from "../OrganizationSection";
import PeriodSelect from "../PeriodSelect";

export interface OrganisasiProps {
  name: string;
  desc: string;
  image: string;
  href: string;
}

export interface OrganisasiSection {
  sectionName: string;
  sectionDesc: string;
  sectionLogo: ReactElement;
  sectionOrgans: Organisasi[];
}

export default async function Organizations({
  period,
  data,
}: {
  period: string;
  data: OrganizationWithPeriod[];
}) {
  const Periods = await findPeriodsThatHaveOrganisasi();
  const periods = Periods.map((periods) => ({
    label: periods.period.replace(/-/, "/"),
    value: periods.period,
  }));

  periods.sort((a, b) => {
    return parseInt(b.value.split("-")[0]) - parseInt(a.value.split("-")[0]);
  });

  const organ = data.filter((a) => {
    return !a.is_suborgan;
  });

  const subOrgan = data.filter((a) => {
    return a.is_suborgan;
  });

  const organizations: OrganisasiSection[] = [
    {
      sectionName: "Organisasi",
      sectionLogo: <FaGlobe className="w-[42px] h-[42px]" />,
      sectionDesc:
        "Struktur organisasi siswa, berbagai kegiatan yang dijalankan, serta peran penting Organisasi dalam membentuk kepemimpinan siswa di SMK Telkom Malang.",
      sectionOrgans: organ,
    },
    {
      sectionName: "Sub-organisasi",
      sectionLogo: <FaUserGroup className="w-[42px] h-[42px]" />,
      sectionDesc:
        "Sub-Organisasi adalah bagian penting dari organisasi siswa di SMK Telkom Malang, yang menampilkan beragam kegiatan dan inovasi yang dijalankan di bawah pengawasan OSIS dan MPK.",
      sectionOrgans: subOrgan,
    },
  ];

  return (
    <div className="pt-[20px] md:pt-0">
      <PeriodSelect period={period} periods={periods} />
      {organizations.map((org) => (
        <OrganizationSection data={org} key={org.sectionName} period={period} />
      ))}
    </div>
  );
}
