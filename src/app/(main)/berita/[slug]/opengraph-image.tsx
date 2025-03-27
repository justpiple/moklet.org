import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { FaPencilAlt } from "react-icons/fa";
import { CSSProperties } from "react";
import { findPost } from "@/utils/database/post.query";
import { stripMarkdown, trimName } from "@/utils/atomics";

const montserratMedium = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Medium.ttf"),
);

const montserratBold = readFileSync(
  path.join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
);

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "600px",
    height: "600px",
    backgroundColor: "#ffffff",
    fontFamily: "Montserrat, sans-serif",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover" as const,
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    padding: "15px 20px",
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "2px",
    flexWrap: "wrap" as const,
    justifyItems: "center",
  },
  tag: {
    backgroundColor: "#FFF0F0",
    color: "#E04E4E",
    borderRadius: "15px",
    fontSize: 12,
    padding: "5px 10px",
  },
  articleContainer: {
    display: "flex",
    flexDirection: "column" as const,
    textAlign: "left" as const,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    color: "#000000",
    marginBottom: 5,
    fontWeight: 700,
    textAlign: "left" as const,
    lineHeight: 1.2,
  },
  content: {
    fontSize: 14,
    color: "#333333",
    marginTop: 5,
    marginBottom: 8,
    lineHeight: 1.4,
    fontWeight: 500,
  },
  author: {
    fontSize: 12,
    marginTop: "8px",
    color: "#333333",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  authorName: {
    fontWeight: 700,
    marginLeft: "3px",
  },
  pencilIcon: {
    marginRight: "4px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E04E4E",
    color: "#FFF",
    padding: "8px 15px",
    position: "absolute",
    bottom: 0,
    width: "100%",
    boxSizing: "border-box" as const,
  },
  footerLogo: {
    height: 25,
  },
  footerText: {
    fontSize: 12,
    fontWeight: 500,
    maxWidth: "400px",
  },
};

export const options: ImageResponseOptions = {
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

export default async function opengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await findPost({ slug: params.slug, published: true });

  if (!post) return <h1>Not Found</h1>;

  const baseUrl = process.env.URL || "https://www.moklet.org";

  const contentPreview =
    stripMarkdown(post.content.split(" ").slice(0, 30).join(" ")) + "...";

  return new ImageResponse(
    (
      <div style={styles.container}>
        <img src={post.thumbnail} alt="Event" style={styles.headerImage} />

        <div style={styles.contentContainer}>
          <div style={styles.tagsContainer}>
            {post.tags.slice(0, 2).map((tag) => (
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
    options,
  );
}
