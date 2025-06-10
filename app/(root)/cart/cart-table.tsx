"use client"

import {Cart} from "@/types";
import {useRouter} from "next/navigation";
import {toast} from "sonner"
import {useTransition} from "react";
import Link from "next/link";
import Image from "next/image";
import {addItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {Loader, ArrowRight, Minus, Plus} from "lucide-react";
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {formatCurrency} from "@/lib/utils";

const CartTable = ({cart}: { cart?: Cart }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty.
                    <Link href="/">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className={"grid md:grid-cols-4 md:gap-5"}>
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/product/${item.slug}`} className={"flex items-center"}>
                                                <Image src={item.image} width={50} height={50} alt={item.name}/>
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>

                                        <TableCell className={"flex-center gap-2"}>
                                            <Button
                                                disabled={isPending}
                                                variant={"outline"}
                                                type={"button"}
                                                onClick={() => startTransition(async () => {
                                                    const res = await removeItemFromCart(item.productId)
                                                    if (!res.success) {
                                                        toast.warning("Failed to remove item from cart")
                                                    }
                                                })}
                                            >
                                                {isPending ? (
                                                    <Loader className="h-4 w-4 animate-spin"/>
                                                ) : (
                                                    <Minus className="h-4 w-4"/>
                                                )}
                                            </Button>

                                            <span>{item.qty}</span>

                                            <Button
                                                disabled={isPending}
                                                variant={"outline"}
                                                type={"button"}
                                                onClick={() => startTransition(async () => {
                                                    const res = await addItemToCart(item)
                                                    if (!res.success) {
                                                        toast.warning("Failed to add item to cart")
                                                    }
                                                })}
                                            >
                                                {isPending ? (
                                                    <Loader className="h-4 w-4 animate-spin"/>
                                                ) : (
                                                    <Plus className="h-4 w-4"/>
                                                )}
                                            </Button>

                                        </TableCell>

                                        <TableCell className={"text-right"}>
                                            € {item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Card>
                        <CardContent className={"p-4 gap-4"}>
                            <div className={"pb-3 text-xl"}>
                                Subtotal({cart.items.reduce(
                                (total, item) => total + item.qty, 0
                            )}):
                                <span className="font-bold text-xl">
                                    {formatCurrency(cart.itemsPrice)}
                                </span>
                            </div>

                            <Button
                                className={"w-full"}
                                disabled={isPending}
                                onClick={() => startTransition(() => router.push("/shipping-address"))}
                            >
                                {isPending ? (
                                    <Loader className="h-4 w-4 animate-spin"/>
                                ):(
                                    <ArrowRight className="h-4 w-4"/>
                                )} Proceed to checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
export default CartTable
