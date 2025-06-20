"use client"

import {useRouter} from "next/navigation";
import {toast} from "sonner"
import {useTransition} from "react";
import {ShippingAddress} from "@/types";
import {shippingAddressSchema} from "@/lib/validators";
import {zodResolver} from "@hookform/resolvers/zod"
import {ControllerRenderProps, useForm, SubmitHandler} from "react-hook-form"
import {z} from "zod"
import {shippingAddressDefaultValues} from "@/lib/constants";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ArrowRight, Loader} from "lucide-react";
import {Button} from "@/components/ui/button";
import { updateUserAddress} from "@/lib/actions/user.actions";


const ShippingAddressForm = ({address}: { address: ShippingAddress }) => {
    const router = useRouter()

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues
    })


    const [isPending, startTransition] = useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            toast.success(res.message);
            router.push('/payment-method');
        })
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Shipping Address</h1>
                <p className="text-sm text-muted-foreground">
                    Please enter your shipping address to complete your order.
                </p>
                <Form {...form}>
                    <form
                        method={"post"}
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*//Full Name*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>, "fullName">}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*//Street Address*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="streetAddress"
                                render={({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>, "streetAddress">}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your street address" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*//City*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>, "city">}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your city" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*//Postal Code*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>, "postalCode">}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your street postal code" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*//Country*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>, "country">}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your street country" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type='submit' disabled={isPending}>
                                Continue
                                {isPending ? (
                                    <Loader className='h-4 w-4 animate-spin' />
                                ) :(
                                    <ArrowRight className='h-4 w-4' />
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}
export default ShippingAddressForm
