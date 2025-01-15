import Maintenance from "@/app/maintenance/page";
import { findOrganisasis } from "@/utils/database/organisasi.query";
import { findLatestPeriod } from "@/utils/database/periodYear.query";
import { redirect } from "next/navigation";

export default async function OrganisasiPage() {
  const [activePeriod, lastPeriod] = await Promise.all([
    findLatestPeriod(true),
    findLatestPeriod(false),
  ]);

  if (!activePeriod && !lastPeriod) return <Maintenance />;

  const organisasis = await findOrganisasis({ period_id: activePeriod.id });
  return redirect(
    `/organisasi/${organisasis.length ? activePeriod.period : lastPeriod.period}`,
  );
}
