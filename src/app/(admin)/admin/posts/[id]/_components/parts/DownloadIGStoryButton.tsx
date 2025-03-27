"use client";

import { FaDownload } from "react-icons/fa";

export default function DownloadIGStoryButton({
  slug,
}: Readonly<{ slug: string }>) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/post/${slug}/instagram-story.png`;
    link.download = `${slug}-instagram-story.png`;
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      title="Download Instagram Story Image"
      className="bg-purple-100 text-purple-800 text-xs font-medium p-2.5 rounded hover:text-white hover:bg-purple-700 transition-all flex items-center justify-center"
    >
      <FaDownload className="mr-2" /> Download Instagram Story
    </button>
  );
}
