import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";

import { addLink } from "@/actions/link";
import { TextField } from "@/app/_components/global/Input";
import { H3 } from "@/app/_components/global/Text";
import { LinkWithCountAndUser } from "@/types/entityRelations";

import FormButton from "./part/SubmitButton";

export default function ModalCreate({
  setIsOpenModal,
}: Readonly<{
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  link?: LinkWithCountAndUser;
}>) {
  const ref = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState(false);

  async function create(formdata: FormData) {
    const toastId = toast.loading("Loading...");
    const result = await addLink(formdata);
    if (result.error) {
      toast.error(result.message, { id: toastId });
    } else {
      toast.success(result.message, { id: toastId });
      setIsOpenModal(false);
      return ref.current?.reset();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
          <form ref={ref} action={create}>
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b">
              <H3 className="text-lg sm:text-xl md:text-2xl">Create Link</H3>
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
                type="url"
                label="Destination"
                name="destLink"
                placeholder="https://example.com/thisisaverylongstringthatyouwouldliketoshorten"
                required={true}
                className="w-full"
              />

              <TextField
                type="text"
                label="Short URL"
                name="slug"
                placeholder="MokletHebat"
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
                  className="w-4 h-4 text-primary-500 accent-primary-500 transition-all"
                  onChange={() => setPassword(!password)}
                />
                <label htmlFor="password" className="text-sm sm:text-base">
                  URL Pribadi
                </label>
              </span>
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
