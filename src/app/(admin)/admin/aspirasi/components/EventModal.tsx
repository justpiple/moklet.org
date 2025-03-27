import { Dispatch, SetStateAction } from "react";
import { FaX } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { upsertEvent } from "@/actions/event";
import { TextField } from "@/app/_components/global/Input";
import SubmitButton from "@/app/_components/global/SubmitButton";
import { H3, P } from "@/app/_components/global/Text";

export default function EventModal({
  setIsOpenModal,
}: Readonly<{
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}>) {
  const { data: session } = useSession();

  async function submitForm(data: FormData) {
    const toastId = toast.loading("Membuat Event...");
    const result = await upsertEvent(data, session?.user?.id || "");

    if (result.success) {
      setIsOpenModal(false);
      return toast.success(result.message, { id: toastId });
    }
    return toast.error(result.message, { id: toastId });
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800/50 sm:pl-64 md:pl-72">
      <div className="relative w-full max-w-md mx-4 sm:mx-auto md:max-w-lg lg:max-w-2xl">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <H3>Tambah Event</H3>
            <button
              type="button"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => setIsOpenModal(false)}
              aria-label="Close"
            >
              <FaX size={20} />
            </button>
          </div>

          <form className="p-4 sm:p-6" action={submitForm}>
            <div className="flex flex-col gap-4">
              <TextField
                type="text"
                label="Nama Event"
                required
                name="eventName"
                className="w-full"
              />

              <div className="w-full">
                <P className="text-black mb-1">Tanggal Event</P>
                <input
                  type="date"
                  required
                  name="eventDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <SubmitButton label="Tambah" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
