"use client"

import React from 'react'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {signUpDefaultValues} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useActionState} from "react";
import {useFormStatus} from "react-dom";
import {signUpUser} from "@/lib/actions/user.actions";
import {useSearchParams} from "next/navigation";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: ""
    })

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const SignUpButton = ()=>{
        const {pending} = useFormStatus()
        return (
            <Button disabled={pending} className={"w-full"} variant={"default"}>
                {pending ? "Submitting..." : "Sign up"}
            </Button>
        )
    }

    return (
        <form action={action}>
            <input type={"hidden"} name={"callbackUrl"} value={callbackUrl}/>
            <div className="space-y-6">
                <div>
                    <Label htmlFor={"name"} className={"mb-1"}>Name</Label>
                    <Input
                        id={"name"}
                        name={"name"}
                        type={"text"}
                        autoComplete={"name"}
                        defaultValue={signUpDefaultValues.name}
                    />
                </div>

                <div>
                    <Label htmlFor={"email"} className={"mb-1"}>Email</Label>
                    <Input
                        id={"email"}
                        name={"email"}
                        type={"text"}
                        autoComplete={"email"}
                        defaultValue={signUpDefaultValues.email}
                    />
                </div>

                <div>
                    <Label htmlFor={"password"}  className={"mb-1"}>Password</Label>
                    <Input
                        id={"password"}
                        name={"password"}
                        type={"password"}
                        autoComplete={"password"}
                        required
                        defaultValue={signUpDefaultValues.password}
                    />
                </div>

                <div>
                    <Label htmlFor={"confirmPassword"} className={"mb-1"}>Confirm Password</Label>
                    <Input
                        id={"confirmPassword"}
                        name={"confirmPassword"}
                        type={"password"}
                        autoComplete={"confirmPassword"}
                        required
                        defaultValue={signUpDefaultValues.confirmPassword}
                    />
                </div>
                <div>
                    <SignUpButton/>
                </div>

                {data && !data.success && (
                    <div className={"text-center text-destructive"}>
                        {data.message}
                    </div>
                )}
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href={"/sign-in"}
                        target={"_self"}
                        className={"link"}
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    )
}
export default SignUpForm
