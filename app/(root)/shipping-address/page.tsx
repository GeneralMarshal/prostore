import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { shippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.actions";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
    title: "Shipping Adress"
}

const shippingAddressPage = async () => {
    const cart = await getMyCart()

    if(!cart || cart.items.length === 0) redirect("/cart")

    const session = await auth()

    const userId = session?.user?.id

    if(!userId){
        throw new Error ("user ID not found")
    }

    const user = await getUserById(userId)

    return (
        <ShippingAddressForm address={user?.address as shippingAddress}/>
    )
}

export default shippingAddressPage