"use server";

import { createHash } from "crypto";

import { revalidatePath } from "next/cache";

import { nextGetServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import generateRandomSlug from "@/utils/randomSlug";

export async function addLink(data: FormData) {
  const session = await nextGetServerSession();
  let hashedpass;
  let slug = data.get("slug") as string | null;
  try {
    if (data.get("password")) {
      hashedpass = createHash("md5")
        .update((data.get("password") as string) || "")
        .digest("hex");
    }
    if (!slug) slug = generateRandomSlug();

    await prisma.link_Shortener.create({
      data: {
        slug,
        target_url: data.get("destLink") as string,
        password: hashedpass,
        user_id: session?.user?.id as string,
      },
    });
    revalidatePath("/admin/link");
    revalidatePath(`/link/${slug}`);
    return { message: "Berhasil menambahkan link!", error: false };
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      message: error.message.includes("PRIMARY")
        ? "Nama atau Short URL sudah ada!"
        : "Gagal menambahkan link!",
      error: true,
    };
  }
}

export async function updateLink(data: FormData) {
  const session = await nextGetServerSession();

  let hashedpass;
  let slug = data.get("slug") as string;
  const id = data.get("id") as string;
  try {
    if (!data.get("private_url")) hashedpass = null;
    else {
      hashedpass = createHash("md5")
        .update((data.get("password") as string) || "")
        .digest("hex");
    }
    if (!slug) slug = generateRandomSlug();

    const update = await prisma.link_Shortener.update({
      where: {
        slug: id,
        user_id:
          session?.user?.role == "SuperAdmin" ? undefined : session?.user?.id,
      },
      data: {
        slug,
        target_url: data.get("target_url") as string,
        password: hashedpass,
      },
    });
    if (!update) throw new Error("Update failed");
    revalidatePath("/admin/link");
    return { message: "Berhasil diperbarui!", error: false };
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      message: error.message.includes("PRIMARY")
        ? "Nama atau Short URL sudah ada!"
        : "Gagal menambahkan link!",
      error: true,
    };
  }
}

export async function deleteLink(slug: string) {
  const session = await nextGetServerSession();
  try {
    const deleteAction = await prisma.link_Shortener.delete({
      where: {
        slug,
        user_id:
          session?.user?.role == "SuperAdmin" ? undefined : session?.user?.id,
      },
    });
    if (!deleteAction) throw new Error("Delete failed");
    revalidatePath("/admin/link");
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return { message: "Gagal dihapus!", error: true };
  }
}
