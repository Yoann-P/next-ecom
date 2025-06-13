"use server"

import {
    shippingAddressSchema,
    signInFormSchema,
    signUpFormSchema,
    paymentMethodSchema
} from "@/lib/validators";
import {auth, signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {hashSync} from "bcrypt-ts-edge";
import {prisma} from '@/db/prisma';
import {formatError} from "@/lib/utils";
import {ShippingAddress} from "@/types";
import {getMyCart} from "@/lib/actions/cart.actions";
import {z} from "zod";


//Sign-in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get("email") as string,
            password: formData.get("password") as string
        })

        await signIn("credentials", user)

        return {
            success: true,
            message: "User signed in successfully"
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            success: false,
            message: "Invalid email or password"
        }
    }
}

//Sign-out the user
export async function signOutUser() {
    try {
        // get current users cart and delete it so it does not persist to next user
        const currentCart = await getMyCart();
        await prisma.cart.delete({where: {id: currentCart?.id}});

        // Deconnect the user
        await signOut()
        return {
            success: true,
            message: "User signed out successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error signing out user",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

//Sign-up the user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string
        })

        const plainPassword = user.password

        user.password = hashSync(user.password, 10)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                //role: "user"
            }
        })

        await signIn("credentials", {
            email: user.email,
            password: plainPassword
        })

        return {
            success: true,
            message: "User registered successfully"
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            success: false,
            message: formatError(error),
        }
    }
}

//Get user by Id
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: {id: userId}
    })
    if (!user) throw new Error("User not found")
    return user
}

//Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth()

        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        })

        if (!currentUser) throw new Error("User not found")

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {
                address
            }
        })

        return {
            success: true,
            message: "User's address updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

// Update the user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        })

        if (!currentUser) throw new Error("User not found")

        const paymentMethod = paymentMethodSchema.parse(data)

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {
                paymentMethod: paymentMethod.type
            }
        })

        return {
            success: true,
            message: "User's payment method updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}