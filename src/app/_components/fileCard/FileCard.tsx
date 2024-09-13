import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Doc, Id } from "@/convex/dataModel";
import {
  EllipsisVerticalIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  Trash2Icon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface FileCardProps {
  file: Doc<"files">;
}

const fileTypesIcons = {
  image: <ImageIcon />,
  pdf: <FileTextIcon />,
  csv: <GanttChartIcon />,
} as Record<Doc<"files">["type"], ReactNode>;

// function getFileUrl(storageId: Id<"_storage">) {
//   const getImageUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_URL}/getImage`);
//   getImageUrl.searchParams.set("storageId", storageId);
//   console.log({ url: getImageUrl.href });

//   return getImageUrl.href;
// }

const FileCardActions = ({ file }: { file: Doc<"files"> }) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();

  return (
    <>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File Deleted",
                  description: "Your file deleted successfully.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsAlertDialogOpen(true)}
            className="flex gap-3 items-center text-red-600 cursor-pointer"
          >
            <Trash2Icon className="w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const FileCard = ({ file }: FileCardProps) => {
  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex gap-2">
          {fileTypesIcons[file.type]}
          {file.name}
        </CardTitle>
        <div className="absolute right-3 top-2">
          <FileCardActions file={file} />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        {fileUrl && file.type === "image" ? (
          <Image alt={file.name} width="200" height="100" src={fileUrl} />
        ) : null}
        {file.type === "csv" ? <GanttChartIcon className="w-20 h-20" /> : null}
        {file.type === "pdf" ? <FileTextIcon className="w-20 h-20" /> : null}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            if (!fileUrl) return;
            window.open(fileUrl, "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};
