import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";
import {PAYMENT_METHODS} from "./constants";

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
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    SessionCartId: z.string().min(1, {message: "Session cart id is required"}),
    userId: z.string().optional().nullable()
})

// Schema for shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, {message: "Name must be at least 3 characters"}),
    streetAddress: z.string().min(3, {message: "StreetAddress must be at least 3 characters"}),
    city: z.string().min(3, {message: "City must be at least 3 characters"}),
    postalCode: z.string().min(3, {message: "Postal Code must be at least 3 characters"}),
    country: z.string().min(3, {message: "Country must be at least 3 characters"}),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

// Schema for payment method
export const paymentMethodSchema = z.object({
    type: z.string().min(1, {message: "Payment method is required"}),
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method'
})

// Schema for inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, {message: "User id is required"}),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: "Invalid payment method"
    }),
    shippingAddress: shippingAddressSchema
})

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
});

// Schema for the PayPal paymentResult
export const paymentResultSchema =z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
})