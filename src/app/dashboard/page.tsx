"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useOrganization, useUser } from "@clerk/nextjs";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Home() {
  const org = useOrganization();
  const user = useUser();
  const orgId: string | undefined = org.organization?.id ?? user.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  return (
    <div>
      <Button
        onClick={() => {
          if (!orgId) return;
          createFile({ name: "passport", orgId });
        }}
      >
        Create File
      </Button>
      {files?.map((file) => (
        <div
          key={file._id}
          style={{ border: "1px solid black", marginBottom: "5px" }}
        >
          <div>{`Name: ${file.name}`}</div>
          <div>{`ID: ${file._id}`}</div>
          <div>{`Created At: ${file._creationTime}`}</div>
        </div>
      ))}
    </div>
  );
}
