import LinkForm from "./_components/LinkForm";
import { findAllLinks } from "@/utils/database/linkShortener.query.ts";
import { nextGetServerSession } from "@/lib/next-auth";
import Links from "./_components/Links";
import { H1 } from "@/app/_components/global/Text";
import { LinkWithCountAndUser } from "@/types/entityRelations";
import { PaginatedResult } from "@/utils/paginator";
import PageNav from "./_components/part/PageNav";

export default async function Shortener({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await nextGetServerSession();
  const { user } = session!;
  const links = (await findAllLinks(
    {
      user_id: user?.role == "SuperAdmin" ? undefined : user?.id,
    },
    parseInt(searchParams.page ?? "1"),
  )) as PaginatedResult<LinkWithCountAndUser>;

  return (
    <>
      <H1>URL Shortener</H1>
      <LinkForm />
      <div className="flex flex-col gap-5">
        <Links links={links.data} />
        <PageNav
          currentPage={links.meta.currentPage}
          totalPage={links.meta.lastPage}
        />
      </div>
    </>
  );
}
