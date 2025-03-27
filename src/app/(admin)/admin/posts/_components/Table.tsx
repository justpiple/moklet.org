"use client";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaRegTrashAlt, FaDownload } from "react-icons/fa";
import { MdPublish, MdUnpublished } from "react-icons/md";
import { toast } from "sonner";

import { postDelete, updatePostStatus } from "@/actions/post";
import { PostWithTagsAndUser } from "@/types/entityRelations";
import { stringifyCompleteDate } from "@/utils/atomics";

export default function PostTable({
  data,
}: Readonly<{ data: PostWithTagsAndUser[] }>) {
  const [loader, setLoader] = useState(true);
  const router = useRouter();

  const columns: TableColumn<PostWithTagsAndUser>[] = [
    {
      name: "Share Image",
      cell: (row: PostWithTagsAndUser) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const link = document.createElement("a");
            link.href = `/api/post/${row.slug}/instagram-story.png`;
            link.download = `${row.slug}-instagram-story.png`;
            link.click();
          }}
          title="Download Instagram Story Image"
          className="bg-purple-100 text-purple-800 text-xs font-medium me-2 p-2.5 rounded hover:text-white hover:bg-purple-700 transition-all flex items-center justify-center"
        >
          <FaDownload />
        </button>
      ),
      width: "80px",
      sortable: false,
    },
    {
      name: "Title",
      selector: (row: PostWithTagsAndUser) => row.title,
      sortable: true,
    },
    {
      name: "Author",
      selector: (row: PostWithTagsAndUser) => row.user.name,
      sortable: true,
    },
    {
      name: "Tag",
      cell: (row: PostWithTagsAndUser) => (
        <span>{row.tags.map((tag) => tag.tagName).join(", ")}</span>
      ),
      sortable: false,
    },
    {
      name: "Date",
      selector: (row: PostWithTagsAndUser) => row.created_at.toString(),
      cell: (row: PostWithTagsAndUser) => (
        <span className=" flex flex-col justify-start">
          <span>
            {row.updated_at > row.created_at ? "Last updated" : "Created at"}
          </span>
          {stringifyCompleteDate(row.updated_at)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: PostWithTagsAndUser) => row.published,
      cell: (row: PostWithTagsAndUser) =>
        row.published ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            Published
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            Draft
          </span>
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: PostWithTagsAndUser) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStatus(row.published, row.id);
            }}
            title={row.published ? "Unpublish post" : "Publish post"}
            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 p-2.5 rounded hover:text-white  hover:bg-blue-700 transition-all"
          >
            {row.published ? <MdUnpublished /> : <MdPublish />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deletePost(row.id);
            }}
            title="Delete Post"
            className="bg-red-100 text-red-800 text-xs font-medium me-2 p-2.5  rounded hover:text-white  hover:bg-red-700 transition-all"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  async function deletePost(id: string) {
    if (
      !confirm(
        "Apakah Anda yakin menghapus Post?\n*Penghapusan tidak dapat dibatalkan",
      )
    )
      return;
    const toastId = toast.loading("Loading...");
    const action = await postDelete(id);
    if (action.error) return toast.error(action.message, { id: toastId });
    toast.success(action.message, { id: toastId });
    router.refresh();
  }

  async function updateStatus(state: boolean, id: string) {
    if (!confirm("Apakah anda ingin mengupdate post ini?")) return;
    const toastId = toast.loading("Loading...");
    const action = await updatePostStatus(state, id);
    if (action.error) return toast.error(action.message, { id: toastId });
    setTimeout(() => {
      toast.success(action.message, { id: toastId });
    }, 3000);
    router.refresh();
  }

  useEffect(() => {
    setLoader(false);
  }, []);

  if (loader) return <div>Loading</div>;

  return (
    <div className="p-2 rounded-md bg-white">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        customStyles={{
          cells: {
            style: {
              "&:hover": {
                cursor: "pointer",
              },
            },
          },
        }}
        onRowClicked={(row: PostWithTagsAndUser) =>
          router.push(`/admin/posts/${row.id}`)
        }
      />
    </div>
  );
}
