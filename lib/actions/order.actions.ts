/*
"use server";

// Create order and the order items
import {convertToPlainObject, formatError} from "@/lib/utils";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {getMyCart} from "./cart.actions";
import {auth} from "@/auth";
import {getUserById} from "./user.actions";
import {insertOrderSchema} from "@/lib/validators";
import {CartItem, PaymentResult} from "@/types";
import {prisma} from '@/db/prisma';
import {paypal} from "../paypal";
import {revalidatePath} from "next/cache";

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
            user: {select: {name: true, email: true}},
        },
    });

    return convertToPlainObject(data);
}

// Create a new PayPal order
export async function createPayPalOrder(orderId: string) {
    try {
        // Get the order from the database.
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        })

        if (order) {
            // Create a new PayPal order.
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
            // Update order with paypal orderId
            await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: "",
                        status: "",
                        pricePaid: 0
                    }
                }
            })

            return {
                success: true,
                message: "PayPal order created",
                data: paypalOrder.id
            }
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//Approve the order and update the order status to paid
export async function approvePaypalOrder(orderId: string, data: {
    orderId: string,
}) {
    try {
        // Get the order from the database.
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        })

        if (!order) {
            throw new Error("Order not found");
        }

        const captureData = await paypal.capturePayment(data.orderId)

        if (!captureData || captureData.id !== (order.paymentResult as PaymentResult)?.id || captureData.status !== "COMPLETED") {
            throw new Error("PayPal payment not approved");
        }

        // Update order status to paid
        await updateOrderToPaid({orderId, paymentResult:{
                id: captureData.id,
                email_address: captureData.payer.email_address,
                status: captureData.status,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
            }})

        revalidatePath(`/order/${orderId}`)

        return {
            success: true,
            message: "PayPal payment approved",
            data: captureData
        }
    } catch
        (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Update order to paid
async function updateOrderToPaid({
                                     orderId,
                                     paymentResult
                                 }: {
    orderId: string,
    paymentResult?: PaymentResult
}) {
    // Get the order from the database.
    const order = await prisma.order.findFirst({
        where: {
            id: orderId
        },
        include: {
            orderitems: true
        }
    })

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.isPaid) {
        throw new Error("Order already paid");
    }

    //Transaction to update order and account for product Stock
    await prisma.$transaction(async (tx) => {
        //Iterate over products and update the stock
        for (const item of order.orderitems) {
            await tx.product.update({
                where: {
                    id: item.productId
                },
                data: {
                    stock: {
                        increment: -item.qty
                    }
                }
            })
        }

        // Set order to paid
        await tx.order.update({
            where: {
                id: order.id
            },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult: paymentResult
            }
        })
    })

    // get updated order after the transaction
    const updatedOrder = await prisma.order.findFirst({
        where: {
            id: orderId
        },
        include: {
            orderitems: true,
            user: {select: {name: true, email: true}},
        }
    })

    if(!updatedOrder) {
        throw new Error("Order not found");
    }
}*/

// Correction
"use server";

import { convertToPlainObject, formatError } from "@/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "./cart.actions";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "@/lib/validators";
import { CartItem, PaymentResult } from "@/types";
import { prisma } from '@/db/prisma';
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

// Crée une commande interne et les items associés
export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error("User not authenticated");

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error("User not found");

        const user = await getUserById(userId);

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: "Your cart is empty",
                redirectTo: "/cart"
            };
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

        // Création de l'objet commande
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // Transaction pour créer la commande et les items
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            const insertOrder = await tx.order.create({ data: order });
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertOrder.id,
                    },
                });
            }
            await tx.cart.update({
                where: { id: cart.id },
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
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error)
        };
    }
}

// Récupère une commande par son ID
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } },
        },
    });
    return convertToPlainObject(data);
}

// Crée une commande PayPal et sauvegarde l'ID PayPal dans la commande interne
export async function createPayPalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({ where: { id: orderId } });
        if (order) {
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: "",
                        status: "",
                        pricePaid: 0
                    }
                }
            });
            return {
                success: true,
                message: "PayPal order created",
                data: paypalOrder.id // <-- C'est cet ID qu'il faut passer au frontend
            };
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

// Capture le paiement PayPal et met à jour la commande comme payée
export async function approvePaypalOrder(
    orderId: string,           // ID interne de la commande
    paypalOrderId: string      // ID de la commande PayPal
) {
    try {
        const order = await prisma.order.findFirst({ where: { id: orderId } });
        if (!order) throw new Error("Order not found");

        // On capture avec l'ID PayPal
        const captureData = await paypal.capturePayment(paypalOrderId);

        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentResult)?.id ||
            captureData.status !== "COMPLETED"
        ) {
            throw new Error("PayPal payment not approved");
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                email_address: captureData.payer.email_address,
                status: captureData.status,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
            }
        });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: "PayPal payment approved",
            data: captureData
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

// Met à jour la commande comme payée et décrémente le stock
async function updateOrderToPaid({
                                     orderId,
                                     paymentResult
                                 }: {
    orderId: string,
    paymentResult?: PaymentResult
}) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderitems: true }
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order already paid");

    await prisma.$transaction(async (tx) => {
        for (const item of order.orderitems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } }
            });
        }
        await tx.order.update({
            where: { id: order.id },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult: paymentResult
            }
        });
    });

    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } },
        }
    });
    if (!updatedOrder) throw new Error("Order not found");
}

