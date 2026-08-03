import { z } from 'zod';

export const runSchema = z.object({
  body: z.object({
    questionId: z.string().optional(),
    sourceCode: z.string().min(1, 'sourceCode is required'),
    language: z.string().min(1, 'language is required'),
    stdin: z.string().optional(),
  }),
});

export const submitSchema = z.object({
  body: z.object({
    questionId: z.string().min(1, 'questionId is required'),
    sourceCode: z.string().min(1, 'sourceCode is required'),
    language: z.string().min(1, 'language is required'),
  }),
});

export const reviewSchema = z.object({
  body: z.object({
   sourceCode: z.string().min(1, 'sourceCode is required'),
   language: z.string().min(1, 'language is required'),
   questionDescription: z.string().optional(),
  }),
});

export const optimizeSchema = z.object({
  body: z.object({
   sourceCode: z.string().min(1, 'sourceCode is required'),
   language: z.string().min(1, 'language is required'),
   questionDescription: z.string().optional(),
  }),
});
