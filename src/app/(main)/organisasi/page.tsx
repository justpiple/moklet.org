import Maintenance from "@/app/maintenance/page";
import { findOrganisasis } from "@/utils/database/organisasi.query";
import { findLatestPeriod } from "@/utils/database/periodYear.query";
import { redirect } from "next/navigation";

export default async function OrganisasiPage() {
  const activePeriod = await findLatestPeriod(true);
  const isActivePeriodhaveOrganisasi =
    (await findOrganisasis({ period_id: activePeriod.id })).length == 0;

  if (!activePeriod) return <Maintenance />;
  else if (isActivePeriodhaveOrganisasi)
    return redirect(`/organisasi/${(await findLatestPeriod(false)).period}`);

  return redirect(`/organisasi/${activePeriod.period}`);
}
