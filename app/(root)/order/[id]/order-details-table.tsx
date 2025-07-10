/*
"use client"

import {Order} from "@/types";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {createPayPalOrder, approvePaypalOrder} from "@/lib/actions/order.actions";
import { toast } from "sonner"

const OrderDetailsTable = ({
                               order,
                               paypalClientId
                           }:
                           {
                               order: Order;
                               paypalClientId: string
                           }) => {
    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt
    } = order

    const PrintLoadingState = ()=>{
    const [{isPending, isRejected}] = usePayPalScriptReducer()
        let status = ""
        if(isPending){
            status="Loading PayPal..."
        } else if(isRejected){
            status="PayPal rejected the payment"
        }
        return status
    }

    const handleCreatePaypalOrder =async ()=>{
        const res = await createPayPalOrder(order.id)

        if(!res.success){
            toast.warning("Something went wrong", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        }
        return res.data
    }

    const handleApprovePaypalOrder = async (data:{orderId: string})=>{
        const res = await approvePaypalOrder(order.id, data)

        if(!res.success){
            toast.warning("Something went wrong", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        } else if(res.success){
            toast.success("Payment approved", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        }
    }

    return (
        <>
            <h1 className={"py-4 text-2xl"}>Order {formatId(id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className={"p-4 gap-4"}>
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Paid</Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">
                                {shippingAddress.streetAddress} , {shippingAddress.city}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant="secondary">
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Delivered</Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderitems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        width={50}
                                                        height={50}
                                                        alt={item.name}
                                                    />
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right">{item.qty}</TableCell>
                                            <TableCell className="text-right">
                                                {item.price} €
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>

                            {/!*Paypal Payment*!/}
                            {
                                !isPaid && "Paypal" === paymentMethod && (
                                    <div>
                                        <PayPalScriptProvider options={{clientId: paypalClientId}}>
                                            <PrintLoadingState/>
                                            <PayPalButtons
                                                createOrder={handleCreatePaypalOrder}
                                                onApprove={handleApprovePaypalOrder}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
export default OrderDetailsTable
*/


// Correction
"use client";

import { Order } from "@/types";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { createPayPalOrder, approvePaypalOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";

const OrderDetailsTable = ({
                               order,
                               paypalClientId,
                           }: {
    order: Order;
    paypalClientId: string;
}) => {
    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt,
    } = order;

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();
        let status = "";
        if (isPending) {
            status = "Loading PayPal...";
        } else if (isRejected) {
            status = "PayPal rejected the payment";
        }
        return status ? <div className="text-sm text-muted-foreground">{status}</div> : null;
    };

    // 1. Crée la commande PayPal côté serveur et retourne l'ID PayPal
    const handleCreatePaypalOrder = async () => {
        const res = await createPayPalOrder(order.id);
        if (!res.success || !res.data) {
            toast.warning("Something went wrong", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => {},
                },
            });
            throw new Error(res.message || "PayPal order creation failed");
        }
        return res.data; // TypeScript : string
    };


    // 2. Capture le paiement PayPal côté serveur avec l'ID PayPal
    const handleApprovePaypalOrder = async (data: any, actions: any) => {
        // data.orderID = l'ID PayPal
        const res = await approvePaypalOrder(order.id, data.orderID);
        if (!res.success) {
            toast.warning("Something went wrong", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => {},
                },
            });
        } else {
            toast.success("Payment approved", {
                description: res.message,
                action: {
                    label: "Close",
                    onClick: () => {},
                },
            });
            // Optionnel : rafraîchir la page ou rediriger
            // window.location.reload();
        }
    };

    return (
        <>
            <h1 className={"py-4 text-2xl"}>Order {formatId(id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className={"p-4 gap-4"}>
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Paid</Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">
                                {shippingAddress.streetAddress} , {shippingAddress.city}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant="secondary">
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not Delivered</Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderitems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        width={50}
                                                        height={50}
                                                        alt={item.name}
                                                    />
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right">{item.qty}</TableCell>
                                            <TableCell className="text-right">
                                                {item.price} €
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>

                            {/* Paypal Payment */}
                            {!isPaid && paymentMethod === "Paypal" && (
                                <div>
                                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                        <PrintLoadingState />
                                        <PayPalButtons
                                            createOrder={handleCreatePaypalOrder}
                                            onApprove={handleApprovePaypalOrder}
                                            onError={(err) => {
                                                toast.error("PayPal error");
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsTable;
