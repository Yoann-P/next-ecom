"use client"


import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Plus} from "lucide-react";
import { toast } from "sonner"
import { CartItem} from "@/types";
import {addItemToCart} from "@/lib/actions/cart.actions";

const AddToCart = ({item}:{item:CartItem}) => {
    const router = useRouter()

    const handleAddToCart = async ()=>{
         const res = await addItemToCart(item)

        if(!res.success){
            toast.error("Something went wrong", {
                description: "We couldn't add the product to your cart",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            return
        }

        //Handle success add to cart
        toast.success("Product added to cart", {
            description: `${item.name} has been added to your cart`,
            action: {
                label: "Go to cart",
                onClick: () => router.push("/cart"),
            },
        })
    }

    return (
        <Button
            className={"w-full"}
            type={"button"}
            onClick= {handleAddToCart}
        >
            <Plus/>AddToCart
        </Button>
    )
}
export default AddToCart
