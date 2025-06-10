import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import {getMyCart} from "@/lib/actions/cart.actions";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {ShippingAddress} from "@/types";
import ShippingAddressForm from "@/app/(root)/shipping-address/shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: 'Shipping Address',
}

const ShippingAddressPage =async () => {
    const cart = await getMyCart()
    if(!cart || cart.items.length === 0){
        return redirect("/cart")
    }

    const session = await auth()

    const userId = session?.user?.id

    if(!userId)  {
        return redirect('/sign-in');
    }

    const user = await getUserById(userId)

    return (
        <div>
            <CheckoutSteps current={1}/>
            <ShippingAddressForm address={user.address as ShippingAddress}/>
        </div>
    )
}
export default ShippingAddressPage
