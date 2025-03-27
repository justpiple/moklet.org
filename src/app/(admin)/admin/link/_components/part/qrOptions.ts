import { Options, FileExtension } from "qr-code-styling";

export const defaultQROptions: Options = {
  type: "svg",
  shape: "square",
  width: 500,
  height: 500,
  data: "https://www.moklet.org/berita/recapan-artikel-februari-2025--banyak-keseruan-sebelum-ramadhan-tiba",
  margin: 0,
  qrOptions: {
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    saveAsBlob: true,
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  dotsOptions: {
    type: "rounded",
    color: "#000000",
    roundSize: true,
  },
  backgroundOptions: { round: 0, color: "transparent" },
  image: "/logogram.png",
  cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
  cornersDotOptions: { type: "dot", color: "#000000" },
};

export const fileExtensions: FileExtension[] = ["svg", "png", "jpeg", "webp"];
