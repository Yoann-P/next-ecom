"use client"

import {Order} from "@/types";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const OrderDetailsTable = ({order}: { order: Order }) => {
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
export default OrderDetailsTable
