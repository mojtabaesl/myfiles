"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { UploadDialog } from "../_components/uploadDialog";
import { FileCard } from "../_components/fileCard";

export default function Home() {
  const org = useOrganization();
  const user = useUser();
  const orgId: string | undefined = org.organization?.id ?? user.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-12">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <UploadDialog />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {files?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>
      </div>
    </main>
  );
}
