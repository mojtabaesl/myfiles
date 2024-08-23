"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);
  return (
    <main>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <h1>hello</h1>
      </Authenticated>
      <Button onClick={() => createFile({ name: "passport" })}>
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
    </main>
  );
}
