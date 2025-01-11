
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {  useRouter } from "next/navigation";

import  { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, User } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const FormSignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
  
    const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: "",
        password: "",
      },
    });
  
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
        });
        if (result?.error) {
          toast({
            title: "Login Failed",
            description: result?.error,
            variant: "destructive",
          });
        }
        if (result?.url) {
          router.replace("/dashboard");
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error signing up user", error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Sign in failed",
          description: axiosError.response?.data.message ?? "Error logging in.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    };
    return (
        <div className=" max-w-2xl">
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Email or Username Field */}
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <span className="flex gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <FormLabel className="text-gray-300">Email or Username</FormLabel>
                                </span>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email or username"
                                        {...field}
                                        className="bg-[#2D2D2D] border-0 text-white placeholder:text-gray-500"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <span className="flex gap-2">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                </span>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...field}
                                        className="bg-[#2D2D2D] border-0 text-white placeholder:text-gray-500"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-b from-[#C1F536] to-[#C1F536]/80 text-black hover:bg-[#D1FF46] transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>

                {/* Sign-Up Link */}
                <div className="text-center mt-6 text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-[#C1F536] hover:underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </Form>
        </div>
    )
}

export default FormSignIn