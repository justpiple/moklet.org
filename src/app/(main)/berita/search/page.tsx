import { NewsFigure } from "@/app/_components/global/NewsFigure";
import { H2 } from "@/app/_components/global/Text";
import { SmallSectionWrapper } from "@/app/_components/global/Wrapper";
import { PostWithTagsAndUser } from "@/types/entityRelations";
import { findPosts } from "@/utils/database/post.query";

import GoBack from "../[slug]/_components/BackButton";
import { SearchBar } from "../_components/SearchBar";

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const posts = (await findPosts({
    published: true,
    OR: (searchParams.q as string).split(" ").map((query) => ({
      title: { contains: query },
    })),
  })) as PostWithTagsAndUser[];

  return (
    <SmallSectionWrapper id="search">
      <GoBack />
      <div className="mt-0 md:mt-8">
        <SearchBar query={searchParams.q} className="pt-0" />
        <div className="">
          <H2 className="mb-[52px]">
            Menampilkan hasil pencarian untuk &quot;
            {searchParams.q?.toString() ?? ""}&quot;
          </H2>
          <div className="w-full flex gap-x-[3.18%] gap-y-[62px]">
            {posts.map((post) => (
              <NewsFigure post={post} key={post.id} />
            ))}
          </div>
        </div>
      </div>
    </SmallSectionWrapper>
  );
}
