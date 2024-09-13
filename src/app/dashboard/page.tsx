"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { UploadDialog } from "../_components/uploadDialog";
import { FileCard } from "../_components/fileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const org = useOrganization();
  const user = useUser();
  const orgId: string | undefined = org.organization?.id ?? user.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isFilesLoading = files === undefined;
  const isFilesListEmpty = files?.length === 0;

  return (
    <main className="container mx-auto pt-12">
      <div className="flex flex-col gap-8">
        {isFilesLoading ? (
          <div className="flex justify-center mt-32">
            <Loader2 className="animate-spin" />
          </div>
        ) : isFilesListEmpty ? (
          <div className="flex flex-col gap-6 items-center mt-32">
            <Image
              src="/empty.svg"
              width="200"
              height="200"
              alt="empty state of files"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-semibold">You have No files</p>
              <p className="text-gray-600">Start uploading your first file</p>
            </div>
            <UploadDialog />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadDialog />
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          {files?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>
      </div>
    </main>
  );
}
