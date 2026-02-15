import { z } from 'zod';

export const ErrorSchema = z.object({
  error: z.string().openapi({
    example: 'An error occurred'
  })
});

export const UsernameParamSchema = z.object({
  username: z.string().openapi({
    param: {
      name: 'username',
      in: 'path'
    },
    example: 'leetcode_user'
  })
});
