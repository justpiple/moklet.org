"use client";

import { useState } from "react";

import Modal from "./Modal";
import { Session } from "next-auth";
export default function AddUser({ session }: { session: Session | null }) {
  const [showModalCreate, setShowModalCreate] = useState(false);
  return (
    <>
      {showModalCreate && (
        <Modal setIsOpenModal={setShowModalCreate} session={session} />
      )}
      <button
        onClick={() => setShowModalCreate(true)}
        className="inline-block w-fit rounded-full bg-primary-400 px-6 py-3 transition-all duration-500 hover:bg-primary-200"
      >
        <span className="text-base text-white">
          <div className="flex items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18V6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add User
          </div>
        </span>
      </button>
    </>
  );
}
