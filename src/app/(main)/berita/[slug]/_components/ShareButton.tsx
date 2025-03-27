"use client";

import { PostWithTagsAndUser } from "@/types/entityRelations";
import { stripMarkdown, trimName } from "@/utils/atomics";
import { FaShareAlt } from "react-icons/fa";

export default function ShareButton({
  post,
  url,
}: Readonly<{ post: PostWithTagsAndUser; url: string }>) {
  const sharePost = async () => {
    const authorName = post.user ? trimName(post.user.name) : "Admin";

    const contentPreview =
      stripMarkdown(post.content.split(" ").slice(0, 30).join(" ")) + "...";

    const shareText = `📢 *MOKLET ORGANIZATION NEWS* 📢\n\n📰 *${post.title}*\n\n${contentPreview}\n\n✍️ Ditulis oleh *${authorName}*\n\n🔎 Baca selengkapnya dan jangan lewatkan informasi penting ini: \n➡️ ${url}`;
    const shareData: ShareData = {
      text: shareText,
    };

    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <button
      className="flex items-center gap-2 text-neutral-500"
      onClick={sharePost}
    >
      <FaShareAlt /> Share
    </button>
  );
}
