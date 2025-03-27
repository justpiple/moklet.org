"use client";

import { H3, P } from "@/app/_components/global/Text";
import { AspirationWithUser } from "@/types/entityRelations";
import { stringifyDate, stripMarkdown } from "@/utils/atomics";
import Link from "next/link";
import { FaWpforms } from "react-icons/fa6";
import { DateIcon, UserIcon } from "./Icons";

export default function AspirationFigure({
  data,
}: Readonly<{ data: AspirationWithUser }>) {
  return (
    <figure className="lg:flex justify-between w-full bg-white rounded-xl px-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-start">
          <span className="p-2  lg:inline-block hidden rounded-full border">
            <FaWpforms className="text-3xl text-gray-400" />
          </span>
          <div className="text-wrap">
            <H3 className="lg:text-[28px] text-[20px]">
              <Link
                href={"/admin/aspirasi/" + data.id}
                className="copy text-black text-wrap break-all hover:text-primary-400 font-semibold hover:cursor-pointer transition-all duration-500 cursor-pointer"
              >
                {data.judul_aspirasi}
              </Link>
            </H3>
            <P className="max-w-full break-all">
              {data.pesan_aspirasi.length > 75
                ? `${stripMarkdown(data.pesan_aspirasi.substring(0, 75))}...`
                : stripMarkdown(data.pesan_aspirasi)}
            </P>
            <div className="pt-5 flex gap-4 flex-col lg:flex-row">
              <span className="flex gap-1 items-center">
                <DateIcon />
                <P>{stringifyDate(data.created_at)}</P>
              </span>
              <span className="flex gap-1 items-center">
                <UserIcon />
                <P>{data.user.name}</P>
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
