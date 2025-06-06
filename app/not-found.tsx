"use client"
import Image from "next/image";
import {Button} from "@/components/ui/button";

const NotFound = () => {
    return (
        <div className={"flex flex-col items-center justify-center min-h-screen"}>
            <Image
                src={"/images/logo.svg"}
                alt={"next-e-commerce-logo"}
                height={48}
                width={48}
                priority={true}/>

            <div className={"p-6 w-1/3 rounded-lg shadow-md text-center"}>
                <h1 className={"text-3xl font-bold mb-4"}>Not Found</h1>
                <p className="text-destructive">Could not find requested page</p>
                <Button
                    variant={"outline"}
                    className={"mt-4 ml-2"}
                    onClick={() => (window.location.href = "/")}
                >
                    Go Home
                </Button>
            </div>
        </div>
    )
}
export default NotFound
