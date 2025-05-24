"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <Button
            className='w-full py-4 px-2 h-4 justify-start'
            variant='ghost'
            disabled={pending}
            onClick={() => {
                startTransition(async () => {
                    await signOutUser();
                    router.refresh(); // Rafraîchit la page pour mettre à jour la session
                });
            }}
            type="button"
        >
            {pending ? "Signing out..." : "Sign Out"}
        </Button>
    );
}
