"use server";

import { revalidatePath } from "next/cache";

import { nextGetServerSession } from "@/lib/next-auth";
import {
  createPeriod,
  deletePeriod,
  findPeriod,
  updatePeriod,
} from "@/utils/database/periodYear.query";

export const upsertPeriod = async (id: string | null, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.role.includes("Admin"))
      return { error: true, message: "Unauthorized" };

    let period = data.get("period") as string;
    const is_active = data.get("is_active") == "true";

    period = period.replace(/\//, "-");

    const findActive = await findPeriod({ is_active: true });

    if (findActive) {
      if (findActive?.id == id && !is_active)
        return { error: true, message: "Harus ada 1 Period yang aktif!" };
      else if (is_active && findActive?.id != id)
        await updatePeriod({ id: findActive?.id }, { is_active: false });
    }

    if (id == null) {
      const create = await createPeriod({ is_active, period });
      if (!create) throw new Error("Update failed");
    } else {
      const update = await updatePeriod({ id }, { is_active, period });
      if (!update) throw new Error("Update failed");
    }

    revalidatePath("/admin/period-config");
    revalidatePath("/organisasi");
    revalidatePath("/organisasi/[period]", "page");
    revalidatePath("/organisasi/[period]/[slug]", "page");
    return { message: "Berhasil disimpan!", error: false };
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      message: error.message.includes("PRIMARY")
        ? "Periode sudah ada!"
        : "Gagal mengubah data",
      error: true,
    };
  }
};

export const deletePeriodById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.role.includes("Admin"))
      return { error: true, message: "Unauthorized" };

    const del = await deletePeriod(id);

    if (!del) throw new Error("Delete failed");

    revalidatePath("/admin/period-config");
    revalidatePath("/organisasi");
    revalidatePath("/organisasi/[period]", "page");
    revalidatePath("/organisasi/[period]/[slug]", "page");
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus data",
      error: true,
    };
  }
};
