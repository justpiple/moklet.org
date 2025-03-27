import type { PostWithTagsAndUser } from "@/types/entityRelations";
import { stripMarkdown } from "@/utils/atomics";
import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "1080px",
    height: "1920px",
    backgroundColor: "#ffffff",
    fontFamily: "Montserrat, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  headerImageContainer: {
    display: "flex",
    position: "relative",
    width: "100%",
    height: "700px",
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0), #ffffff)",
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    padding: "50px 70px",
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  tagsContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    justifyItems: "center",
  },
  tag: {
    backgroundColor: "#FFF0F0",
    color: "#E04E4E",
    borderRadius: "36px",
    fontSize: 30,
    padding: "17px 28px",
    fontWeight: 500,
  },
  articleContainer: {
    display: "flex",
    flexDirection: "column" as const,
    textAlign: "left" as const,
    marginTop: 16,
  },
  title: {
    fontSize: 55,
    color: "#000000",
    marginBottom: 24,
    fontWeight: 700,
    textAlign: "left" as const,
    lineHeight: 1.2,
  },
  content: {
    fontSize: 34,
    color: "#333333",
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 1.5,
    fontWeight: 500,
  },
  author: {
    fontSize: 30,
    marginTop: "28px",
    color: "#333333",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  authorName: {
    fontWeight: 700,
    marginLeft: "4px",
  },
  pencilIcon: {
    marginRight: "6px",
  },
  readMoreContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    width: "100%",
    marginBottom: "30px",
    paddingLeft: "50px",
    paddingRight: "50px",
  },
  readMoreBox: {
    display: "flex",
    backgroundColor: "#ffffff",
    padding: "24px 32px",
    borderRadius: "18px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
    width: "100%",
  },
  readMoreText: {
    fontSize: 32,
    fontWeight: 500,
    color: "#E04E4E",
    backgroundColor: "#FFF0F0",
    padding: "16px 24px",
    borderRadius: "16px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E04E4E",
    color: "#FFF",
    padding: "32px 50px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  footerLogo: {
    height: 60,
  },
  footerText: {
    fontSize: 26,
    fontWeight: 500,
    maxWidth: "50%",
    textAlign: "right",
  },
};

export default function InstagramStory({
  post,
  baseUrl,
}: Readonly<{ post: PostWithTagsAndUser; baseUrl: string }>) {
  const contentPreview =
    stripMarkdown(post.content.split(" ").slice(0, 30).join(" ")) + "...";

  return (
    <div style={styles.container}>
      <div style={styles.headerImageContainer}>
        <img src={post.thumbnail} alt="Event" style={styles.headerImage} />
        <div style={styles.gradientOverlay}></div>
      </div>

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
            Ditulis oleh
            <span style={styles.authorName}> {post.user.name}</span>
          </p>
        </div>
      </div>

      <div style={styles.readMoreContainer}>
        <div style={styles.readMoreBox}>
          <div style={styles.readMoreText}>BACA SELENGKAPNYA</div>
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
  );
}
