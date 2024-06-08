"use server";

import { Prisma, Suborgan_Type } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createSubOrgan } from "@/utils/database/subOrgan.query";

import { imageUploader } from "./fileUploader";

export async function createPeriod(inputValue: string) {
  try {
    const period = await prisma.period_Year.create({
      data: { period: inputValue },
    });
    revalidatePath("/admin/sub-organ/create");
    return { status: "OK", message: "Period berhasil dibuat!", period };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal membuat periode!" };
  }
}

export async function suborganCreate(data: FormData) {
  try {
    const suborgan = data.get("suborgan") as Suborgan_Type;
    const description = data.get("description") as string;
    const suborgan_name = data.get("suborgan_name") as string;
    const vision = data.get("vision") as string;
    const mission = data.get("mission") as string;
    const companion = data.get("companion") as string;
    const structure = data.get("structure") as string;
    const contact = data.get("contact") as string;
    const start_date = data.get("start_date") as string;
    //image and logo
    const image = data.get("image") as File;
    const logo = data.get("logo") as File;
    const imageBuffer = await image.arrayBuffer();
    const logoBuffer = await logo.arrayBuffer();
    const uploadImage = await imageUploader(Buffer.from(imageBuffer));
    const uploadLogo = await imageUploader(Buffer.from(logoBuffer));

    const period: Prisma.Period_YearCreateOrConnectWithoutSuborgansInput = {
      create: { period: data.get("period") as string },
      where: { period: data.get("period") as string },
    };

    await createSubOrgan({
      suborgan: suborgan,
      description: description,
      image: uploadImage.data?.url as string,
      logo: uploadLogo.data?.url as string,
      suborgan_name: suborgan_name,
      vision: vision,
      mission: mission,
      companion: companion,
      structure: structure,
      contact: contact,
      period: period,
      start_date: start_date,
    });
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal menambahkan Sub-Organ Profile" };
  }
}
