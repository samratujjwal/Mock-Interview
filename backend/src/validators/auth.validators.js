import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../constants/auth.constants.js";

export const signupBodySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(80, "Name must contain at most 80 characters."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .toLowerCase()
    .max(254, "Email must contain at most 254 characters.")
    .email("Email must be valid."),
  password: z
    .string({ required_error: "Password is required." })
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`,
    ),
});

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .toLowerCase()
    .email("Email must be valid."),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),
});
