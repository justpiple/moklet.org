import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticle, WithContext } from "schema-dts";

import Image from "@/app/_components/global/Image";
import { Tags } from "@/app/_components/global/NewsFigure";
import { H2, H3, H4, P } from "@/app/_components/global/Text";
import { SmallSectionWrapper } from "@/app/_components/global/Wrapper";
import { stringifyDate, trimName } from "@/utils/atomics";
import { findPost, updatePost } from "@/utils/database/post.query";

import GoBack from "./_components/BackButton";
import MdViewer from "./_components/MdViewer";
import Related from "./_components/RelatedNews";
import ShareButton from "./_components/ShareButton";

function getOgImageUrl(slug: string, updatedAt: Date | string) {
  const timestamp =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : new Date(updatedAt).getTime();

  const baseUrl = process.env.URL || "https://www.moklet.org";
  return `${baseUrl}/api/post/${slug}/og-image.png?v=${timestamp}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await findPost({ slug: params.slug, published: true });

  if (!post)
    return {
      title: "Berita tidak ditemukan",
    };

  const baseUrl = process.env.URL || "https://www.moklet.org";

  return {
    title: post.title,
    description: post.description.trim() || null,
    authors: { name: post.user.name },
    openGraph: {
      url: `${baseUrl}/berita/${post.slug}`,
      title: post.title,
      images: [{ url: getOgImageUrl(post.slug, post.updated_at) }],
      description: post.description.trim() || undefined,
      type: "article",
      publishedTime: new Date(post.published_at!).toISOString(),
      modifiedTime: new Date(post.updated_at).toISOString(),
      authors: post.user.name,
    },
    robots: "max-image-preview:large",
    keywords:
      "smk telkom malang, moklet, " +
      post.tags.map((tag) => tag.tagName).join(", "),
  };
}

export default async function Post({
  params,
}: Readonly<{ params: { slug: string } }>) {
  const baseUrl = process.env.URL || "https://www.moklet.org";
  const post = await findPost({ slug: params.slug, published: true });

  if (!post) notFound();
  else await updatePost({ id: post.id }, { view_count: { increment: 1 } });

  const ogImageUrl = getOgImageUrl(post.slug, post.updated_at);

  const jsonLd: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    image: ogImageUrl,
    description: post.description,
    headline: post.title,
    datePublished: new Date(post.published_at!).toISOString(),
    dateModified: new Date(post.updated_at).toISOString(),
    thumbnailUrl: ogImageUrl,
  };

  return (
    <SmallSectionWrapper id={"Post-" + params.slug}>
      <div className="w-full flex gap-[92px] xl:gap-0 xl:justify-between xl:flex-row flex-col">
        <div className="w-full xl:w-[60%] flex flex-col gap-[52px]">
          <div className="w-full block">
            <div className="flex gap-[18px] lg:gap-[32px] items-center mb-8">
              <GoBack />
              <div>
                <H2 className="text-wrap hidden lg:block">{post?.title}</H2>
                <H4 className="text-wrap block lg:hidden">{post?.title}</H4>
              </div>
            </div>
            <div className="w-full flex md:items-center gap-2 md:gap-0 flex-col md:flex-row md:justify-between">
              <div className="max-w-full flex items-center justify-between md:gap-8 md:w-[40%]">
                <div className="flex items-center gap-3">
                  <Image
                    src={post?.user.user_pic}
                    alt={post?.user.name + "'s Pfp"}
                    unoptimized
                    height={28}
                    width={28}
                    className="h-7 w-7 object-cover rounded-full"
                  />
                  <span className="text-base text-black">
                    {trimName(post?.user.name)}
                  </span>
                </div>
                <P>{stringifyDate(post?.created_at)}</P>
              </div>
              <P>{post.view_count} views</P>
            </div>
          </div>
          <div>
            <div className="w-full h-[253px] md:h-[450px] xl:w-650px mb-[52px] lg:mb-[72px]">
              <Image
                src={post?.thumbnail}
                alt={"image-" + post?.title}
                width={768}
                height={450}
                className="w-full h-full rounded-[20px]"
                unoptimized
              />
            </div>
            <div className="w-full">
              <div className="mb-[42px] flex flex-col lg:flex-row justify-between items-start gap-[32px] lg:items-center">
                <div className="flex flex-wrap gap-[10px]">
                  {post?.tags.map((tag) => (
                    <Tags tag={tag} key={tag.tagName} />
                  ))}
                </div>
                <ShareButton
                  url={`${baseUrl}/berita/${post.slug}`}
                  post={post}
                />
              </div>
              <MdViewer markdown={post?.content} />
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:w-[34%] gap-[52px] w-full">
          <H3>Berita Terkait</H3>
          <Related currentPostId={post.id} tags={post.tags} />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SmallSectionWrapper>
  );
}
