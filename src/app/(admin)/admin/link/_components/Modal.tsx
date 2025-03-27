import { Dispatch, SetStateAction, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";

import { updateLink } from "@/actions/link";
import { TextField } from "@/app/_components/global/Input";
import { H3 } from "@/app/_components/global/Text";
import { LinkWithCountAndUser } from "@/types/entityRelations";

import FormButton from "./part/SubmitButton";

export default function Modal({
  setIsOpenModal,
  link,
}: Readonly<{
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  link?: LinkWithCountAndUser;
}>) {
  const [password, setPassword] = useState(!!link?.password);

  async function update(formdata: FormData) {
    const toastId = toast.loading("Loading...");
    const result = await updateLink(formdata);
    if (!result.error) {
      toast.success(result.message, { id: toastId });
      setIsOpenModal(false);
    } else toast.error(result.message, { id: toastId });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
          <form action={update}>
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b">
              <H3 className="text-lg sm:text-xl md:text-2xl">Link Shortener</H3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-all"
                onClick={() => setIsOpenModal(false)}
              >
                <FaX size={20} className="sm:size-22 md:size-25" />
                <span className="sr-only">Tutup</span>
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
              <TextField
                type="text"
                name="target_url"
                required
                value={link?.target_url}
                label="Target Link"
                placeholder="https://example.com/blablablablablabla"
                className="w-full"
              />

              <TextField
                type="text"
                name="slug"
                label="Short URL"
                value={link?.slug}
                placeholder="mylink"
                required
                className="w-full"
              />

              {password && (
                <TextField
                  type="password"
                  label="Password"
                  placeholder="*******"
                  name="password"
                  className="w-full"
                />
              )}

              <span className="flex items-center gap-2">
                <input
                  id="password"
                  type="checkbox"
                  name="private_url"
                  defaultChecked={!!link?.password}
                  className="w-4 h-4 text-primary-500 accent-primary-500 transition-all"
                  onChange={() => setPassword(!password)}
                />
                <label htmlFor="password" className="text-sm sm:text-base">
                  URL Pribadi
                </label>
              </span>

              <input type="hidden" name="id" value={link?.slug} />
            </div>

            <div className="flex items-center justify-end p-3 sm:p-4 md:p-5 border-t border-gray-200">
              <FormButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
