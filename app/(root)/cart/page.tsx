import CartTable from "@/app/(root)/cart/cart-table";
import {getMyCart} from "@/lib/actions/cart.actions";

export const metadata = {
    title: "ShoppingCart",
}

const CartPage =async () => {
    const cart = await getMyCart()

    return (
        <div>
            <CartTable cart={cart}/>
        </div>
    )
}
export default CartPage
