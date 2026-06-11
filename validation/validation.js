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

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number({ required_error: 'Price is required' }).positive("Price must be greater than 0"),
    description: z.string().min(1, "Description is required"),
    stock: z.number({ required_error: 'Stock is required' }).int("Stock cannot be negative")
})