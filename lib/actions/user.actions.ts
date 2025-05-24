"use server"

import {signInFormSchema, signUpFormSchema} from "@/lib/validators";
import {signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {hashSync} from "bcrypt-ts-edge";
import {prisma} from '@/db/prisma';
import {formatError} from "@/lib/utils";


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