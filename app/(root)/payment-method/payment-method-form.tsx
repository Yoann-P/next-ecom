"use client"

import {useRouter} from "next/navigation";
import {toast} from "sonner"
import {useTransition} from "react";
import {paymentMethodSchema, shippingAddressSchema} from "@/lib/validators";
import {zodResolver} from "@hookform/resolvers/zod";
import {ControllerRenderProps, useForm} from "react-hook-form";
import {z} from "zod";
import {DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS} from "@/lib/constants";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowRight, Loader} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {updateUserPaymentMethod} from "@/lib/actions/user.actions";

const PaymentMethodForm = ({preferredPaymentMethod}:
                           { preferredPaymentMethod: string | null }) => {

    const router = useRouter()
    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    })

    const [isPending, startTransition] = useTransition()

    const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
        startTransition(async () => {
            const res = await updateUserPaymentMethod(values);
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            toast.success(res.message);
            router.push('/place-order');
        })
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Payment Method</h1>
                <p className="text-sm text-muted-foreground">
                    Please choose your preferred payment method.
                </p>
                <Form {...form}>
                    <form
                        method={"post"}
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*//Radio payment method*/}
                        <div className="flex flex-col md:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem className={"space-y-3"}>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                className="flex flex-col space-y-2"
                                                value={field.value}
                                            >
                                                {PAYMENT_METHODS.map((paymentMethod) => (
                                                    <FormItem
                                                        key={paymentMethod}
                                                        className={"flex items-center space-x-3 space-y-0"}
                                                    >
                                                        <FormControl>
                                                            <RadioGroupItem value={paymentMethod} checked={field.value === paymentMethod} />
                                                        </FormControl>
                                                        <FormLabel className={"font-normal"}>
                                                            {paymentMethod}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
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
                                    <Loader className='h-4 w-4 animate-spin'/>
                                ) : (
                                    <ArrowRight className='h-4 w-4'/>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}
export default PaymentMethodForm
