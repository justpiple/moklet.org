"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import { defaultQROptions, fileExtensions } from "./part/qrOptions";
import { H3, P } from "@/app/_components/global/Text";
import { Button } from "@/app/_components/global/Button";

interface QRModalProps {
  setIsOpenQRModal: (isOpen: boolean) => void;
  url: string;
}

export default function QRModal({
  setIsOpenQRModal,
  url,
}: Readonly<QRModalProps>) {
  const [options] = useState<Options>({
    ...defaultQROptions,
    data: url,
  });
  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, []);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFileExt(event.target.value as FileExtension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt,
      name: `qr-${new URL(url).pathname.split("/").pop()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full my-auto">
        <div className="flex justify-between items-center mb-6">
          <H3 className="text-xl font-semibold">QR Code</H3>
          <button
            onClick={() => setIsOpenQRModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div
            ref={ref}
            className="w-48 h-48 flex items-center justify-center"
          ></div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-center">
            <P className="text-sm text-gray-500 mb-2">URL</P>
            <P className="line-clamp-3 text-sm">{url}</P>
          </div>

          <div className="flex items-center gap-2">
            <select
              onChange={onExtensionChange}
              value={fileExt}
              className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
            >
              {fileExtensions.map((ext) => (
                <option key={ext} value={ext}>
                  {ext.toUpperCase()}
                </option>
              ))}
            </select>

            <Button
              variant={"primary"}
              onClick={onDownloadClick}
              className="bg-primary-400 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Download
            </Button>
          </div>

          <button
            onClick={() => setIsOpenQRModal(false)}
            className="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-all duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
