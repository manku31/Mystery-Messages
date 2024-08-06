"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function UserPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ username: string }>(); // type is optional

  // zod implement
  const form = useForm<z.infer<typeof messageSchema>>({
    // type of form is optional
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  async function onSubmit(data: z.infer<typeof messageSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/sendMessage`, {
        username: params.username,
        content: data.content,
      });

      toast({
        title: "Message send successful",
        description: response.data.messages,
      });
    } catch (error) {
      console.error("Error in verification, Error : ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "failed to send message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Public Profile Link
        </h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Send Anonymous Message to @{params.username}
          </h2>
          <div className="flex items-center border border-gray-300 rounded-lg p-4 bg-gray-50">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field, formState }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="input w-full p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                          placeholder="Write your anonymous message here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 "
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Send it"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
