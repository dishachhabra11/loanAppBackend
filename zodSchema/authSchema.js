//this file sets the schema to validate the user input for the authentication routes using zod
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email("invalid email"),
  password: z
    .string()
    .min(6, "password must be 8 characters long")
    .max(100, "password must be less than 100 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must contain atleast one uppercase, lowercase, number and special character"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});