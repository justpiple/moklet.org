/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MultiValue } from "react-select";
import { toast } from "sonner";

import { postCreate } from "@/actions/post";
import Image from "@/app/_components/global/Image";
import { TextArea, TextField } from "@/app/_components/global/Input";
import { TagWithPostCount } from "@/types/entityRelations";

import Tags from "./Tags";
import Modal from "../../_components/ImageModal";
import Editor from "../../_components/MdEditor";
import FormButton from "../../_components/parts/SubmitButton";

export default function PostForm({ tags }: { tags: TagWithPostCount[] }) {
  const [tag, setTag] =
    useState<MultiValue<{ value: string; label: string }>>();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(
    "https://www.waterfieldtechnologies.com/wp-content/uploads/2019/02/placeholder-image-gray-3x2-300x200.png",
  );

  useEffect(() => {
    if (
      session?.user?.role! === "Admin" ||
      session?.user?.role! === "SuperAdmin"
    ) {
      return;
    }
    setTag([{ label: session?.user?.role!, value: session?.user?.role! }]);
  }, [session?.user?.role]);

  return (
    <>
      {isOpen && <Modal setIsOpenModal={setIsOpen} />}
      <form
        action={async (data) => {
          const result = await postCreate(data, value, tag!);
          if (result.error) {
            return toast.error(result.message);
          }
          toast.success(result.message);
          redirect("/admin/posts");
        }}
        className="flex flex-col gap-y-3"
      >
        <TextField
          type="text"
          label="Judul Post"
          name="title"
          required={true}
          handleChange={(e) => {
            const splitString = e.currentTarget.value
              .replace(/[^a-zA-Z0-9   ]/g, "")
              .toLowerCase()
              .split(" ");
            const slug = splitString.join("-");
            setSlug(slug);
          }}
          placeholder="Apa?! ini dosa besar penjual kantin! Nomor 5 bikin cengang"
        />
        <TextArea
          label="Deskripsi"
          name="desc"
          placeholder="berita tentang bblaballala"
          required
        />
        <TextField
          type="text"
          label="Custom Slug"
          name="slug"
          value={slug}
          placeholder="berita-paling-panas-2024"
        />
        <Tags tags={tags} setState={setTag} state={tag} session={session} />
        <div className="flex flex-col">
          <label
            htmlFor="thumbnail"
            className="first-letter:capitalize after:text-red-500 after:content-['*']"
          >
            Thumbnail
          </label>
          <Image
            className="w-[300px] h-[200px] rounded-2xl object-cover mb-2"
            width={300}
            height={200}
            title="Preview gambar"
            alt="Preview gambar"
            src={image}
            unoptimized
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(URL.createObjectURL(e.target.files![0]));
            }}
            name="thumbnail"
            required
            className="border border-neutral-500 border-dotted rounded-xl py-5 px-3"
          />
        </div>
        <Editor
          onChange={(data) => {
            setValue(data!);
          }}
          value={value}
        />
        <FormButton />
      </form>
    </>
  );
}
