"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { MultiValue } from "react-select";

import { uploadImageCloudinary } from "@/actions/fileUploader";
import prisma from "@/lib/prisma";
import {
  updatePost,
  createPost,
  deletePost,
} from "@/utils/database/post.query";
import { nextGetServerSession } from "@/lib/next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadInsert(data: Record<string, any>) {
  try {
    const result = await uploadImageCloudinary(Buffer.from(data.data));

    return result;
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal mengupload file!" };
  }
}

export async function upload(data: FormData) {
  const image = data.get("image") as File;
  const ABuffer = await image.arrayBuffer();

  try {
    const result = await uploadImageCloudinary(Buffer.from(ABuffer));

    return {
      status: "OK",
      url: result.data?.url,
      message: "Link dicopy di clipboard!",
    };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal mengupload file!" };
  }
}

export async function createTag(inputValue: string) {
  try {
    const tag = await prisma.tag.create({ data: { tagName: inputValue } });
    revalidatePath("/admin/posts/create");
    return { status: "OK", message: "Tag berhasil dibuat!", tag };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal membuat tag!" };
  }
}

export async function postCreate(
  data: FormData,
  MD: string,
  tags: MultiValue<{ value: string; label: string }>,
) {
  const session = await nextGetServerSession();

  if (!session?.user?.id) return { error: true, message: "Unauthorized" };

  try {
    const title = data.get("title") as string;
    const slug = data.get("slug") as string;
    const description = data.get("desc") as string;
    const tag: Prisma.TagCreateOrConnectWithoutPostsInput[] = tags.map(
      (tag) => ({
        where: { tagName: tag.value },
        create: { tagName: tag.value },
      }),
    );
    const image = data.get("thumbnail") as File;
    const ABuffer = await image.arrayBuffer();
    const upload = await uploadImageCloudinary(Buffer.from(ABuffer));

    const newPost = await createPost({
      slug: slug,
      content: MD,
      title: title,
      description: description,
      thumbnail: upload.data?.url as string,
      reaction: [],
      tags: { connectOrCreate: tag },
      user_id: session?.user?.id,
      created_at: new Date(),
      updated_at: new Date(),
      published: false,
    });

    if (!newPost) return { error: true, message: "Gagal membuat post!" };

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/admin/posts");
    revalidatePath("/organisasi/[period]/[slug]", "page");

    return { message: "Success", result: { id: newPost.id } };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal menambahkan berita!" };
  }
}

export async function postUpdate(
  data: FormData,
  MD: string,
  tags: MultiValue<{ value: string; label: string }>,
  id: string,
) {
  const session = await nextGetServerSession();

  if (!session?.user?.id) return { error: true, message: "Unauthorized" };
  try {
    const title = data.get("title") as string;
    const slug = data.get("slug") as string;
    const description = data.get("desc") as string;
    const tag: Prisma.TagCreateOrConnectWithoutPostsInput[] = tags.map(
      (tag) => ({
        where: { tagName: tag.value },
        create: { tagName: tag.value },
      }),
    );
    const image = data.get("thumbnail") as File;
    let upload;
    if (image) {
      const ABuffer = await image.arrayBuffer();
      upload = await uploadImageCloudinary(Buffer.from(ABuffer));
    }

    const update = await updatePost(
      {
        id: id,
        user_id: !session?.user.role.includes("Admin")
          ? session?.user.id
          : undefined,
      },
      {
        slug: slug ?? undefined,
        content: MD ?? undefined,
        title: title ?? undefined,
        description: description ?? undefined,
        thumbnail: upload?.data?.url ?? undefined,
        tags: { connectOrCreate: tag },
        updated_at: new Date(),
      },
    );
    if (!update) return { error: true, message: "Gagal update post!" };

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${update.slug}`);
    revalidatePath(`/api/post/${update.slug}/og-image.png`);
    revalidatePath("/admin/posts");
    revalidatePath("/organisasi/[period]/[slug]", "page");
    revalidatePath(`/admin/posts/${update.slug}`);
    return { message: "Success" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal update berita!" };
  }
}

export async function updatePostStatus(current_state: boolean, id: string) {
  try {
    const update = await updatePost(
      { id: id },
      {
        published: !current_state,
        updated_at: new Date(),
        published_at: !current_state ? new Date() : undefined,
      },
    );

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${update.slug}`);
    revalidatePath(`/api/post/${update.slug}/og-image.png`);
    revalidatePath("/admin/posts");
    revalidatePath("/organisasi/[period]/[slug]", "page");
    revalidatePath(`/admin/posts/${update.slug}`);
    return { message: "Berhasil megupdate post!" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal mengupdate post" };
  }
}

export async function postDelete(id: string) {
  try {
    const post = await deletePost(id);

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${post.slug}`);
    revalidatePath(`/api/post/${post.slug}/og-image.png`);
    revalidatePath("/admin/posts");
    revalidatePath("/organisasi/[period]/[slug]", "page");
    revalidatePath(`/admin/posts/${post.slug}`);
    return { message: "Berhasil menghapus post!" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Gagal menghapus post" };
  }
}
