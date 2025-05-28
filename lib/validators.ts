import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";

const currency = z
    .string()
    .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), {
        message: "Invalid price format",
    })

//Schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters"}),
    slug: z.string().min(3, {message: "Slug must be at least 3 characters"}),
    category: z.string().min(3, {message: "Category must be at least 3 characters"}),
    description: z.string().min(3, {message: "Description must be at least 3 characters"}),
    brand: z.string().min(3, {message: "Brand must be at least 3 characters"}),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, {message: "At least one image is required"}),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

//Schema for signing user in
export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

//Schema for signing user up
export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

// Cart Schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, {message: "Product id is required"}),
    name: z.string().min(1, {message: "Product name is required"}),
    slug: z.string().min(1, {message: "Product slug is required"}),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, {message: "Product image is required"}),
    price: currency
})

export const insertCartSchema = z.object({
    items:z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, {message: "Session cart id is required"}),
    userId: z.string().optional().nullable()
})