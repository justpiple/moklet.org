"use client";

import { useEffect, useState } from "react";
import { FaGlobeAsia, FaQrcode } from "react-icons/fa";
import { toast } from "sonner";
import ClipboardJS from "clipboard";

import { deleteLink } from "@/actions/link";
import { H3, P } from "@/app/_components/global/Text";
import { LinkWithCountAndUser } from "@/types/entityRelations";
import { stringifyDate } from "@/utils/atomics";

import {
  CopyIcon,
  DateIcon,
  DeleteIcon,
  EditIcon,
  StatsIcon,
  UserIcon,
} from "./Icons";
import Modal from "./Modal";
import QRModal from "./QRModal";

export default function LinkFigure({
  link,
}: Readonly<{ link: LinkWithCountAndUser }>) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenQRModal, setIsOpenQRModal] = useState(false);
  const fullUrl = `https://go.moklet.org/${link.slug}`;

  useEffect(() => {
    const clipboard = new ClipboardJS(".copy");

    clipboard.on("success", function (e) {
      e.clearSelection();
      toast.success("Link berhasil disalin!");
    });

    // eslint-disable-next-line no-unused-vars
    clipboard.on("error", function (_e) {
      console.log("Error copying text");
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  async function deleteAction(slug: string) {
    if (!confirm("Anda yakin ingin menghapus item ini?")) return;
    const toastId = toast.loading("Loading...");
    const result = await deleteLink(slug);
    if (!result.error) toast.success(result.message, { id: toastId });
    else toast.error(result.message, { id: toastId });
  }

  return (
    <figure className="w-full bg-white rounded-xl p-4 md:p-6">
      {isOpenModal && <Modal setIsOpenModal={setIsOpenModal} link={link} />}
      {isOpenQRModal && (
        <QRModal setIsOpenQRModal={setIsOpenQRModal} url={fullUrl} />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-start">
          <span className="p-2 hidden md:inline-flex rounded-full border">
            <FaGlobeAsia className="text-2xl md:text-3xl text-gray-400" />
          </span>
          <div className="text-wrap max-w-full overflow-hidden">
            <H3 className="text-xl md:text-2xl lg:text-[28px]">
              <span
                data-clipboard-text={fullUrl}
                className="copy text-black text-wrap break-all hover:text-gray-8 font-semibold hover:cursor-pointer transition-all duration-500 cursor-pointer"
              >
                <span className="inline-block">go.moklet.org/</span>
                <span className="inline-block truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[350px] align-bottom">
                  {link.slug}
                </span>
              </span>
            </H3>
            <P className="line-clamp-1 xl:line-clamp-2 break-all w-full md:max-w-lg">
              {link.target_url}
            </P>
            <div className="pt-3 md:pt-5 flex flex-wrap gap-3 md:gap-4">
              <span className="flex gap-1 items-center">
                <StatsIcon />
                <P>{link.count?.click_count}</P>
              </span>
              <span className="flex gap-1 items-center">
                <DateIcon />
                <P>{stringifyDate(link.created_at)}</P>
              </span>
              <span className="flex gap-1 items-center">
                <UserIcon />
                <P>{link.user.name}</P>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
          <button
            data-clipboard-text={fullUrl}
            title="Copy Link"
            className="copy group border border-primary-400 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-primary-400/50 transition-all duration-500"
          >
            <span className="flex items-center gap-2 transition-all duration-500">
              <CopyIcon />
              <P className="text-base md:text-lg font-semibold text-primary-400 transition-all duration-500">
                Copy
              </P>
            </span>
          </button>

          <button
            onClick={() => setIsOpenQRModal(true)}
            title="Generate QR"
            className="group border border-primary-400 px-3 py-2 sm:py-3 rounded-xl hover:bg-primary-400/50 transition-all duration-500"
          >
            <span className="text-primary-400 flex items-center gap-2 transition-all duration-500">
              <FaQrcode size={24} className="md:w-6 md:h-6" />
            </span>
          </button>

          <button
            onClick={() => setIsOpenModal(true)}
            title="Edit Link"
            className="group border border-gray-400 px-3 py-2 sm:py-3 rounded-xl hover:bg-gray-100 transition-all duration-500"
          >
            <span className="flex items-center gap-2 transition-all duration-500">
              <EditIcon />
            </span>
          </button>

          <button
            onClick={() => deleteAction(link.slug)}
            title="Delete Link"
            className="group border border-gray-400 px-3 py-2 sm:py-3 rounded-xl hover:bg-gray-100 transition-all duration-500"
          >
            <span className="flex items-center gap-2 transition-all duration-500">
              <DeleteIcon />
            </span>
          </button>
        </div>
      </div>
    </figure>
  );
}
