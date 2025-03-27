"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Organisasi_Type, UnitSekolah } from "@prisma/client";
import { TextField, SelectField } from "@/app/_components/global/Input";
import { Button } from "@/app/_components/global/Button";

export default function FilterSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDateRange = searchParams.get("dateRange") || "last6Months";
  const currentCategory = searchParams.get("category") || "all";
  const currentOrganization = searchParams.get("organization") || "all";
  const currentSchoolUnit = searchParams.get("schoolUnit") || "all";
  const currentFromDate = searchParams.get("fromDate") || "";
  const currentToDate = searchParams.get("toDate") || "";

  const [dateRangeType, setDateRangeType] = useState(
    currentFromDate && currentToDate ? "custom" : currentDateRange,
  );

  const [fromDate, setFromDate] = useState(currentFromDate);
  const [toDate, setToDate] = useState(currentToDate);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    const params = new URLSearchParams(searchParams.toString());

    if (
      value === "all" &&
      (name === "organization" || name === "schoolUnit" || name === "category")
    ) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    if (name === "dateRange") {
      setDateRangeType(value);

      if (value !== "custom") {
        params.delete("fromDate");
        params.delete("toDate");
      }
    }

    router.push(`?${params.toString()}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "fromDate") {
      setFromDate(value);
    } else if (name === "toDate") {
      setToDate(value);
    }
  };

  const applyCustomDateRange = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    params.set("dateRange", "custom");

    router.push(`?${params.toString()}`);
  };

  const dateRangeOptions = [
    { value: "last1Month", label: "1 Bulan Terakhir" },
    { value: "last3Months", label: "3 Bulan Terakhir" },
    { value: "last6Months", label: "6 Bulan Terakhir" },
    { value: "last1Year", label: "1 Tahun Terakhir" },
    { value: "last2Years", label: "2 Tahun Terakhir" },
    { value: "custom", label: "Custom" },
  ];

  const categoryOptions = [
    { value: "all", label: "Semua Jenis" },
    { value: "event", label: "Event" },
    { value: "organization", label: "Organisasi" },
    { value: "schoolUnit", label: "Unit Sekolah" },
  ];

  const organizationOptions = [
    { value: "all", label: "Semua Organisasi" },
    ...Object.values(Organisasi_Type).map((org) => ({
      value: org,
      label: org,
    })),
  ];

  const schoolUnitOptions = [
    { value: "all", label: "Semua Unit" },
    ...Object.values(UnitSekolah).map((unit) => ({
      value: unit,
      label: unit,
    })),
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-medium mb-4">Filter Statistik</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Rentang Waktu"
          name="dateRange"
          options={dateRangeOptions}
          value={dateRangeType}
          handleChange={handleFilterChange}
        />

        {dateRangeType === "custom" && (
          <>
            <TextField
              label="Dari Tanggal"
              name="fromDate"
              type="date"
              value={fromDate}
              handleChange={handleDateChange}
            />
            <TextField
              label="Sampai Tanggal"
              name="toDate"
              type="date"
              value={toDate}
              handleChange={handleDateChange}
            />
            <div className="md:col-span-2 lg:col-span-3">
              <Button onClick={applyCustomDateRange} variant={"primary"}>
                Terapkan
              </Button>
            </div>
          </>
        )}

        <SelectField
          label="Jenis Aspirasi"
          name="category"
          options={categoryOptions}
          value={currentCategory}
          handleChange={handleFilterChange}
        />

        {(currentCategory === "all" || currentCategory === "organization") && (
          <SelectField
            label="Organisasi"
            name="organization"
            options={organizationOptions}
            value={currentOrganization}
            handleChange={handleFilterChange}
          />
        )}

        {(currentCategory === "all" || currentCategory === "schoolUnit") && (
          <SelectField
            label="Unit Sekolah"
            name="schoolUnit"
            options={schoolUnitOptions}
            value={currentSchoolUnit}
            handleChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
}
