"use client"


import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Plus, Minus, Loader} from "lucide-react";
import { toast } from "sonner"
import {Cart, CartItem} from "@/types";
import {addItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {useTransition} from "react";

const AddToCart = ({cart, item}:{cart?:Cart, item:CartItem}) => {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const handleAddToCart = async ()=>{
        startTransition(async ()=>{
            const res = await addItemToCart(item)

            if(!res.success){
                toast.warning("Something went wrong", {
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
                description: res.message,
                action: {
                    label: "Go to cart",
                    onClick: () => router.push("/cart"),
                },
            })
        })
    }

    // Handle remove from cart
    const handleRemoveFromCart = async ()=>{
        startTransition(async ()=>{
            const res = await removeItemFromCart(item.productId)

            if(!res.success){
                toast.warning("Something went wrong", {
                    description: "We couldn't remove the product to your cart",
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                })
                return
            }
            //Handle success remove from cart
            toast.error("Product removed from cart", {
                description: res.message,
                action: {
                    label: "Go to cart",
                    onClick: () => router.push("/cart"),
                },
            })
        })
    }

    // Check if item is in cart
    const existItem = cart && cart.items
        .find((x)=>x.productId === item.productId)

    return existItem ? (
    <div>
        <Button
            type={"button"}
            variant={"outline"}
            onClick={handleRemoveFromCart}
        >
            {isPending ? (
                <Loader className={"h-4 w-4 animate-spin"}/>
            ) : (<Minus className={"h-4 w-4"}/>)}
        </Button>

        <span className="px-2">{existItem.qty}</span>

        <Button
            type={"button"}
            variant={"outline"}
            onClick={handleAddToCart}
        >
            {isPending ? (
                <Loader className={"h-4 w-4 animate-spin"}/>
            ):(<Plus className={"h-4 w-4"}/>)}
        </Button>
    </div>
    ) : (
        <Button
            className={"w-full"}
            type={"button"}
            onClick= {handleAddToCart}
        >
            {isPending ? (
                <Loader className={"h-4 w-4 animate-spin"}/>
            ):(<Plus className={"h-4 w-4"}/>)}{" "}Add to cart
        </Button>
    )
}
export default AddToCart
