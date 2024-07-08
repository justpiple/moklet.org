"use server";

import { Prisma, Organisasi_Type } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  createOrganisasi,
  updateOrganisasi,
} from "@/utils/database/organisasi.query";
import { imageUploader } from "./fileUploader";

export async function organisasiUpsert({
  data,
  structure,
  period,
  id,
  organisasiType,
}: {
  data: FormData;
  structure: string;
  period: string;
  id: string | null;
  organisasiType: Organisasi_Type;
}) {
  try {
    const description = data.get("description") as string;
    const organisasi_name = data.get("organisasi_name") as string;
    const vision = data.get("vision") as string;
    const mission = data.get("mission") as string;
    const companion = data.get("companion") as string;
    const contact = data.get("contact") as string;
    const image_description = data.get("image_description") as string;
    const is_suborgan = data.get("is_suborgan") == "true";

    const image = data.get("image") as File;
    const logo = data.get("logo") as File;
    let uploadImage;
    let uploadLogo;

    if (image) {
      const imageBuffer = await image.arrayBuffer();
      uploadImage = await imageUploader(Buffer.from(imageBuffer));
    }
    if (logo) {
      const logoBuffer = await logo.arrayBuffer();
      uploadLogo = await imageUploader(Buffer.from(logoBuffer));
    }

    const organisasiInput = {
      organisasi: organisasiType,
      description: description,
      is_suborgan,
      organisasi_name,
      vision,
      mission,
      companion,
      structure,
      contact,
      image_description,
    };
    if (id == null) {
      await createOrganisasi({
        ...organisasiInput,
        image: uploadImage?.data?.url || "",
        logo: uploadLogo?.data?.url || "",
        period: { connect: { period } },
      });
    } else {
      await updateOrganisasi(
        { id },
        {
          ...organisasiInput,
          image: uploadImage?.data?.url as string | undefined,
          logo: uploadLogo?.data?.url as string | undefined,
        },
      );
    }
    return { error: false, message: "Sukses update data" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal update data" };
  }
}