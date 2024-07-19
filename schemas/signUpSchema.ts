import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be atlest 3 characters")
  .max(8, "username must be no more then 8 characters")
  .regex(
    /[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi,
    "username must not content special characters"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email addres" }),
  password: z
    .string()
    .min(6, { message: "Password must be atlest 6 characters" }),
});
