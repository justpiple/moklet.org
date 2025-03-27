import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { FaPencilAlt } from "react-icons/fa";
import { CSSProperties } from "react";
import { findPost } from "@/utils/database/post.query";
import { stripMarkdown, trimName } from "@/utils/atomics";
import { notFound } from "next/navigation";

const montserratMedium = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Medium.ttf"),
);

const montserratBold = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
);

const styles: Record<string, CSSProperties> = {
  // styles tetap sama seperti sebelumnya
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "600px",
    height: "600px",
    backgroundColor: "#ffffff",
    fontFamily: "Montserrat, sans-serif",
    position: "relative",
  },
  // ...styles lainnya tetap sama
};

const options: ImageResponseOptions = {
  width: 600,
  height: 600,
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

export const revalidate = 7200;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await findPost({
    slug: slug,
    published: true,
  });

  if (!post) return notFound();

  const baseUrl = process.env.URL || "https://www.moklet.org";

  const contentPreview =
    stripMarkdown(post.content.split(" ").slice(0, 30).join(" ")) + "...";

  const headers = new Headers({
    "Cache-Control":
      "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
  });

  return new ImageResponse(
    (
      <div style={styles.container}>
        <img src={`${post.thumbnail}`} alt="Event" style={styles.headerImage} />
        <div style={styles.contentContainer}>
          <div style={styles.tagsContainer}>
            {post.tags.slice(0, 3).map((tag) => (
              <div key={`tag-${tag.tagName}`} style={styles.tag}>
                {tag.tagName}
              </div>
            ))}
          </div>

          <div style={styles.articleContainer}>
            <h1 style={styles.title}>{post.title}</h1>

            <p style={styles.content}>{contentPreview}</p>

            <p style={styles.author}>
              <FaPencilAlt style={styles.pencilIcon} size={10} /> Ditulis oleh
              <span style={styles.authorName}>{trimName(post.user.name)}</span>
            </p>
          </div>
        </div>

        <div style={styles.footer}>
          <img
            src={`${baseUrl}/horizontal-white.svg`}
            alt="Moklet.org Logo"
            style={styles.footerLogo}
          />
          <p style={styles.footerText}>
            Portal menuju kegiatan organisasi kreatif & inovatif di MOKLET
          </p>
        </div>
      </div>
    ),
    {
      ...options,
      headers,
    },
  );
}
