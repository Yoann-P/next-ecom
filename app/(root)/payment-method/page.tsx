import React from 'react'
import {Metadata} from 'next'
import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import PaymentMethodForm from "@/app/(root)/payment-method/payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: 'Payment Method',
}

const PaymentMethodPage =async () => {
    const session = await auth()
    const userId = session?.user?.id

    if(!userId)  {
        return redirect('/sign-in');
    }

    const user = await getUserById(userId)

    return (
        <div>
            <CheckoutSteps current={2}/>
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
        </div>
    )
}
export default PaymentMethodPage
