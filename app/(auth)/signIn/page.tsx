"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { signInSchema } from "@/schemas/signInSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignIn() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // zod implement
  const form = useForm<z.infer<typeof signInSchema>>({
    // type of form is optional
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmiting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      // console.log("response : ", response);  // better way to handel error

      if (response?.error) {
        toast({
          title: "Sign in failed",
          description: "Invalid user",
          variant: "destructive",
        });
      }

      if (response?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error in sign in, Error : ", error);
      toast({
        title: "Sign In failed",
        description: "Inernal server error",
        variant: "destructive",
      });
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in and start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmiting}>
              {isSubmiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
