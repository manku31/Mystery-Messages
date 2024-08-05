import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";

type messageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: messageCardProps) {
  const { toast } = useToast();

  async function handelDeleteMessage() {
    const response = await axios.delete(`/api/deleteMessage/${message._id}`);
    console.log("response", response);

    toast({
      title: response.data.messages,
    });
    onMessageDelete(message._id);
  }

  const formattedDate = new Date(message.createAt)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " at")
    .replace(/\//g, "-");

  return (
    <Card className="flex flex-row items-center">
      <div className="flex-grow">
        <CardHeader>
          <CardTitle>{message.content}</CardTitle>
        </CardHeader>
        <CardFooter>{formattedDate}</CardFooter>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="ml-auto mr-4">
            <X className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handelDeleteMessage}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
