"use server";

// Create order and the order items
import {convertToPlainObject, formatError} from "@/lib/utils";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {getMyCart} from "./cart.actions";
import {auth} from "@/auth";
import {getUserById} from "./user.actions";
import {insertOrderSchema} from "@/lib/validators";
import {CartItem} from "@/types";
import {prisma} from '@/db/prisma';

export async function createOrder() {
    try {
        const session = await auth()
        if (!session) throw new Error("User not authenticated")

        const cart = await getMyCart()
        const userId = session?.user?.id
        if (!userId) throw new Error("User not found")

        const user = await getUserById(userId)

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: "Your cart is empty",
                redirectTo: "/cart"
            }
        }

        if (!user.address) {
            return {
                success: false,
                message: 'No shipping address',
                redirectTo: '/shipping-address'
            };
        }

        if (!user.paymentMethod) {
            return {
                success: false,
                message: 'No payment method',
                redirectTo: '/payment-method'
            };
        }

        //Create order object
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // Create a transaction to create order and order items in databasse
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            //create order
            const insertOrder = await tx.order.create({data: order});
            //create order items from the cart items
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertOrder.id,
                    },
                });
            }
            //clear cart
            await tx.cart.update({
                where: {id: cart.id},
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });
            return insertOrder.id;
        });
        if (!insertedOrderId) throw new Error('Order not created');
        return {
            success: true,
            message: 'Order created',
            redirectTo: `/order/${insertedOrderId}`
        }
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//Get order by id
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {
            id: orderId
        },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } },
        },
    });

    return convertToPlainObject(data);
}
