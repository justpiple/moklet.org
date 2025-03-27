"use client";

import LinkButton, { Button } from "@/app/_components/global/Button";
import { SelectField } from "@/app/_components/global/Input";
import { H4, P } from "@/app/_components/global/Text";
import { getDateMonths } from "@/utils/atomics";
import { Event } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import EventModal from "./EventModal";
import { FaRegFileExcel, FaChartBar } from "react-icons/fa";

const organisasis = [
  "OSIS",
  "MPK",
  "BDI",
  "PALWAGA",
  "PASKATEMA",
  "TSBC",
  "TSFC",
  "TSVC",
  "PMR",
  "MEMO",
  "MAC",
  "METIC",
  "COMET",
  "PUSTEL",
  "DA",
].map((a) => ({ label: a, value: a }));

const units = [
  "KURIKULUM",
  "KESISWAAN",
  "SARPRA",
  "HUBIN",
  "ISO",
  "TU",
  "GURU",
].map((a) => ({ label: a, value: a }));

units.push({ label: "SATPAM / CS", value: "SATPAMCS" });

export default function Filter({ event }: Readonly<{ event: Event[] }>) {
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const organ = searchParams.get("organisasi");
  const eventQuery = searchParams.get("event");
  const unit = searchParams.get("unit");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const events = event.map((a) => ({ label: a.event_name, value: a.id }));

  interface DateRange {
    from: string;
    to: string;
  }

  const getLastSixMonths = (): DateRange => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    return {
      from: sixMonthsAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const dateMax = from ? getDateMonths(new Date(from), 6) : new Date();

  interface ParamUpdates {
    organisasi?: string;
    unit?: string;
    event?: string;
    from?: string;
    to?: string;
    [key: string]: string | undefined;
  }

  const createSearchParams = (updates: ParamUpdates): URLSearchParams => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.organisasi) {
      params.delete("unit");
      params.delete("event");
    } else if (updates.unit) {
      params.delete("organisasi");
      params.delete("event");
    } else if (updates.event) {
      params.delete("organisasi");
      params.delete("unit");
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    return params;
  };

  const handleOrganisasiChange = (value: string): void => {
    const dateRange = getLastSixMonths();
    const params = createSearchParams({
      organisasi: value.toLowerCase(),
      from: dateRange.from,
      to: dateRange.to,
    });

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleUnitChange = (value: string): void => {
    const dateRange = getLastSixMonths();
    const params = createSearchParams({
      unit: value.toLowerCase(),
      from: dateRange.from,
      to: dateRange.to,
    });

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleEventChange = (value: string): void => {
    const params = createSearchParams({
      event: value,
      from: from || "",
      to: to || "",
    });

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleFromDateChange = (value: string): void => {
    const params = createSearchParams({
      [organ ? "organisasi" : "unit"]: organ || unit || "",
      from: value,
      to: to || "",
    });

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleToDateChange = (value: string): void => {
    const params = createSearchParams({
      [organ ? "organisasi" : "unit"]: organ || unit || "",
      from: from || "",
      to: value,
    });

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleViewStatistics = () => {
    const params = new URLSearchParams();

    if (organ) {
      params.set("organization", organ.toUpperCase());
      params.set("category", "organization");
    } else if (unit) {
      params.set("schoolUnit", unit.toUpperCase());
      params.set("category", "schoolUnit");
    } else if (eventQuery) {
      params.set("event", eventQuery);
      params.set("category", "event");
    }

    if (from) {
      params.set("fromDate", from);
    }

    if (to) {
      params.set("toDate", to);
    }

    if (from && to) {
      params.set("dateRange", "custom");
    } else {
      params.set("dateRange", "last6Months");
    }

    router.push(`/admin/aspirasi/statistics?${params.toString()}`);
  };

  return (
    <>
      {openAddEvent && <EventModal setIsOpenModal={setOpenAddEvent} />}

      <section
        id="filter"
        className="flex flex-col gap-5 mb-10 p-4 bg-gray-50 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800">Filter Aspirasi</h3>

        {!(unit || eventQuery) && (
          <div className="w-full">
            <P className="mb-2 font-medium">Organisasi</P>
            <SelectField
              name="organisasi"
              options={organisasis}
              value={organ || undefined}
              handleChange={(e) => handleOrganisasiChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {!(organ || eventQuery) && (
          <div className="w-full">
            <P className="mb-2 font-medium">Unit Sekolah</P>
            <SelectField
              name="units"
              value={unit || undefined}
              options={units}
              handleChange={(e) => handleUnitChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {!(unit || organ) && (
          <div className="w-full">
            <P className="mb-2 font-medium">Event</P>
            <div className="flex w-full gap-2">
              <SelectField
                name="event"
                options={events}
                value={eventQuery || ""}
                handleChange={(e) => handleEventChange(e.target.value)}
                className="w-full"
              />
              <Button
                variant="primary"
                onClick={() => setOpenAddEvent(true)}
                className="whitespace-nowrap"
              >
                Add Event
              </Button>
            </div>
          </div>
        )}

        {(organ || unit) && (
          <div className="w-full">
            <P className="mb-2 font-medium text-gray-800">Range Tanggal</P>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex flex-col gap-1">
                <P>Dari tanggal</P>
                <input
                  type="date"
                  value={from || ""}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <H4 className="self-end mb-2">-</H4>
              <div className="flex flex-col gap-1">
                <P>Sampai tanggal</P>
                <input
                  type="date"
                  value={to || ""}
                  min={
                    from
                      ? new Date(from).toISOString().split("T")[0]
                      : undefined
                  }
                  max={from ? dateMax.toISOString().split("T")[0] : undefined}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={handleViewStatistics}
          className="flex items-center justify-center gap-2 w-full md:w-auto md:self-center mt-2"
        >
          <FaChartBar />
          Lihat Statistik
        </Button>

        {(organ || unit || from || to || eventQuery) && (
          <div className="flex justify-between mt-2">
            <LinkButton
              variant="tertiary"
              href="/admin/aspirasi"
              className="text-sm"
            >
              Clear Filters
            </LinkButton>
            <LinkButton
              href={"aspirasi/excel?" + searchParams.toString()}
              variant="primary"
              className="flex gap-2 items-center text-sm"
              disabledProgressBar
              target="_blank"
              prefetch={false}
            >
              <FaRegFileExcel />
              Download Excel
            </LinkButton>
          </div>
        )}
      </section>
    </>
  );
}
