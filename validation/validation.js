import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be 8 characters or more')
})

export const loginSchema = z.object({
    email: z.string().email('Wrong credentials'),
    password: z.string().min(8, 'Wrong credentials')
})