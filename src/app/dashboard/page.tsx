"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  files: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "At least one file is required",
  }),
});

export default function Home() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const org = useOrganization();
  const user = useUser();
  const orgId: string | undefined = org.organization?.id ?? user.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("files");
  const handleSubmit = async ({ title, files }: z.infer<typeof formSchema>) => {
    try {
      if (!orgId) return;

      const fileUrl = await generateUploadUrl();
      const result = await fetch(fileUrl, {
        method: "POST",
        headers: { "Content-Type": files[0].type },
        body: files[0],
      });

      const { storageId } = await result.json();
      await createFile({ name: title, orgId, fileId: storageId });
      form.reset();
      setIsFileDialogOpen(false);
      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Now everyone in your team can view your file",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Your file cloud not be uploaded, try again later",
      });
    }
  };

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <Dialog
          open={isFileDialogOpen}
          onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
          }}
          modal
        >
          <DialogTrigger asChild>
            <Button>Upload File</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload your file</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input
                            className="cursor-pointer"
                            type="file"
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  {/* <Button>Cancel</Button> */}
                  <Button
                    type="submit"
                    className="flex gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : null}
                    <span>
                      {form.formState.isSubmitting ? "Uploading" : "Upload"}
                    </span>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
