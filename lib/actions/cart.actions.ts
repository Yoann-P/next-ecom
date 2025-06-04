"use server"

import {cookies} from "next/headers"
import {CartItem} from "@/types";
import {convertToPlainObject, formatError, round2} from "@/lib/utils";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {cartItemSchema, insertCartSchema} from "@/lib/validators";
import {revalidatePath} from "next/cache";
import {Prisma} from "@prisma/client";


//Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
            items.reduce(
                (acc, item) => acc + Number(item.price) * item.qty, 0)
        ),
        shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
        taxPrice = round2(0.2 * itemsPrice),
        totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value
        if (!sessionCartId) throw new Error(" Cart session not found")

        //Get Session and User Id
        const session = await auth()
        const userid = session?.user?.id ? (session.user.id as string) : undefined

        //Get Cart
        const cart = await getMyCart()

        //Parse & validate item
        const item = cartItemSchema.parse(data)

        //Find product in database
        const product = await prisma.product.findFirst({
            where: {
                id: item.productId
            }
        })
        if (!product) throw new Error("Product not found")

        if (!cart) {
            //Create new cart object
            const newCart = insertCartSchema.parse({
                userId: userid,
                items: [item],
                SessionCartId: sessionCartId,
                ...calcPrice([item])
            })
            //Add to database
            await prisma.cart.create({
                data: newCart
            })

            //Revalidate productpage
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} added to cart`
            }
        } else {
            // Check if product is already in cart
            const existingItem = (cart.items as CartItem[]).find(
                (x) => x.productId === item.productId
            )

            if (existingItem) {
                // Check the stock
                if (product.stock < existingItem.qty + 1) {
                    throw new Error(`Product ${product.name} is out of stock`)
                }
                // Increase the qty
                (cart.items as CartItem[]).find(
                    (x) => x.productId === item.productId
                )!.qty = existingItem.qty + 1
            } else {
                // If item does not exist in cart check the stock
                if (product.stock < 1) {
                    throw new Error(`Product ${product.name} is out of stock`)
                }
                // Add new item to cart
                cart.items.push(item)
            }
            //Save to the database
            await prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput [],
                    ...calcPrice(cart.items as CartItem[])
                }
            })
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} ${existingItem ? "qty updated" : "added"} to cart`
            }
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

export async function getMyCart() {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if (!sessionCartId) throw new Error(" Cart session not found")

    //Get Session and User Id
    const session = await auth()
    const userid = session?.user?.id ? (session.user.id as string) : undefined

    //Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userid ? {userId: userid} : {SessionCartId: sessionCartId},
    })

    if (!cart) return undefined

    //Convert decimal and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}

export async function removeItemFromCart(productId: string) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value
        if (!sessionCartId) throw new Error(" Cart session not found")

        // Get Product
        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })
        if (!product) throw new Error("Product not found")

        // Get user cart
        const cart = await getMyCart()
        if (!cart) throw new Error("Cart not found")

        // Check for item
        const exist = (cart.items as CartItem[])
            .find(x => x.productId === productId)

        if (!exist) throw new Error("Item not found")

        // Check if only one in qty
        if(exist.qty === 1){
            //Remove item from cart
            cart.items = (cart.items as CartItem[])
                .filter((x)=> x.productId !== productId)
        } else {
            // Decrease the qty
            (cart.items as CartItem[])
                .find((x) => x.productId === productId)!.qty = exist.qty - 1
        }

        //Update Cart in database
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data:{
                items: cart.items as Prisma.CartUpdateitemsInput [],
                ...calcPrice(cart.items as CartItem[])
            }
        })

        revalidatePath(`/product/${product.slug}`)

        return {
            success: true,
            message: `${product.name} removed from cart`
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

