"use server";

import { revalidatePath } from "next/cache";
import { nextGetServerSession } from "@/lib/next-auth";
import {
  createTwibbon,
  deleteTwibbon,
  updateTwibbon,
} from "@/utils/database/twibbon.query";
import { slugify } from "@/utils/atomics";
import { uploadImageCloudinary } from ".";

export const upsertTwibbon = async (id: string | null, data: FormData) => {
  try {
    const session = await nextGetServerSession();

    if (!session || !session.user)
      return { success: false, message: "Unauthorize" };

    const title = data.get("title") as string;
    const frame_url = data.get("frame_url") as File;
    const caption = data.get("caption") as string;

    let uploadFrame;

    if (frame_url) {
      const imageBuffer = await frame_url.arrayBuffer();
      uploadFrame = await uploadImageCloudinary(Buffer.from(imageBuffer));
    }

    const slug = slugify(title, "");

    //@typescript-eslint/no-non-null-asserted-optional-chain
    if (id == null) {
      const create = await createTwibbon({
        title,
        frame_url: uploadFrame?.data?.url || "",
        slug,
        user_id: session?.user?.id,
        caption: caption,
      });
      if (!create) throw new Error("Update failed");
    } else {
      const update = await updateTwibbon(
        {
          id,
          user_id:
            session?.user?.role == "SuperAdmin" ? undefined : session?.user?.id,
        },
        {
          frame_url: uploadFrame?.data?.url || undefined,
          title,
          slug,
          caption,
        },
      );
      if (!update) throw new Error("Update failed");
    }

    revalidatePath("/admin/twibbon");
    revalidatePath(`/twbn/${slug}`);
    return { message: "Berhasil disimpan!", success: true };
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      message: error.message.includes("PRIMARY")
        ? "Judul sudah ada!"
        : "Gagal mengubah data",
      success: false,
    };
  }
};

export const deleteTwibbonById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    const del = await deleteTwibbon(
      id,
      session?.user?.role == "SuperAdmin" ? undefined : session?.user?.id,
    );

    if (!del) throw new Error("Delete failed");

    revalidatePath("/admin/twibbon");
    revalidatePath(`/twbn/${del.slug}`);
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus data",
      error: true,
    };
  }
};
