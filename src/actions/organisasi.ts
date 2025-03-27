"use server";

import { Organisasi_Type } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  createOrganisasi,
  updateOrganisasi,
} from "@/utils/database/organisasi.query";
import { uploadImageCloudinary } from "./fileUploader";

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

    const image = data.get("image") as File | undefined;
    const logo = data.get("logo") as File | undefined;

    let uploadedImage;
    let uploadedLogo;

    if (image) {
      const imageBuffer = await image.arrayBuffer();
      uploadedImage = await uploadImageCloudinary(Buffer.from(imageBuffer));
    }
    if (logo) {
      const logoBuffer = await logo.arrayBuffer();
      uploadedLogo = await uploadImageCloudinary(Buffer.from(logoBuffer));
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
    if (id == null || id === "") {
      await createOrganisasi({
        ...organisasiInput,
        image: uploadedImage?.data?.url as string,
        logo: uploadedLogo?.data?.url as string,
        period: { connect: { period } },
      });
    } else {
      await updateOrganisasi(
        { id },
        {
          ...organisasiInput,
          image: uploadedImage?.data?.url,
          logo: uploadedLogo?.data?.url,
        },
      );
    }

    revalidatePath("/organisasi");
    revalidatePath(`/organisasi/${period}`);
    revalidatePath(`/organisasi/${period}/${organisasiType}`);
    revalidatePath(`/admin/organisasi/${period}`);
    revalidatePath(`/admin/organisasi/${period}/${organisasiType}`);
    revalidatePath("/admin/period-config");
    return { error: false, message: "Sukses update data" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal update data" };
  }
}
