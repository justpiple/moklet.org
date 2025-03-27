import { notFound, redirect } from "next/navigation";

import { H1 } from "@/app/_components/global/Text";
import { nextGetServerSession } from "@/lib/next-auth";
import { TagWithPostCount } from "@/types/entityRelations";
import { findPost } from "@/utils/database/post.query";
import { findAllTags } from "@/utils/database/tag.query";

import EditForm from "./_components/Form";
import PublishButton from "./_components/parts/PublishButton";
import DownloadIGStoryButton from "./_components/parts/DownloadIGStoryButton";

export const revalidate = 0;

export default async function Edit({ params }: { params: { id: string } }) {
  const session = await nextGetServerSession();
  const data = await findPost({ id: params.id ?? "" });
  if (
    !(session?.user?.role === "Admin" || session?.user?.role === "SuperAdmin")
  ) {
    if (session?.user?.role !== data?.user?.role || !session)
      return redirect("/unauthorized");
  }
  const tags = (await findAllTags()) as TagWithPostCount[];

  if (!data) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <H1>Edit Post</H1>
          <DownloadIGStoryButton slug={data.slug} />
        </div>
        <PublishButton state={data.published} id={data.id} />
      </div>
      <EditForm tags={tags} post={data} />
    </div>
  );
}
