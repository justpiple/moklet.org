import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { findPost } from "@/utils/database/post.query";
import InstagramStory from "./components/InstagramStory";
import { notFound } from "next/navigation";

const montserratMedium = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Medium.ttf"),
);

const montserratBold = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
);

const options: ImageResponseOptions = {
  width: 1080,
  height: 1920,
  fonts: [
    {
      name: "Montserrat",
      data: montserratMedium,
      weight: 500,
      style: "normal",
    },
    {
      name: "Montserrat",
      data: montserratBold,
      weight: 700,
      style: "normal",
    },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await findPost({ slug, published: true });

  if (!post) return notFound();

  const baseUrl = process.env.URL || "https://www.moklet.org";

  return new ImageResponse(
    <InstagramStory baseUrl={baseUrl} post={post} />,
    options,
  );
}
