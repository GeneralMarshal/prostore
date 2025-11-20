"use server";

import { CartItem, shippingAddress } from "@/types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { formatErrors } from "../utils";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema, shippingAddressSchema } from "../validator";
import { round2 } from "../utils";
import { revalidatePath } from "next/cache";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.14 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for session cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
      throw new Error("Cart session was not found");
    }

    // Get session and user Id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart from the database
    const cart = await getMyCart();

    // parse and validate the submitted item data
    const cartItem = cartItemSchema.parse(data);

    // Find product in the database
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    if (!product) {
      throw new Error("Product was not found");
    }

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [cartItem],
        sessionCartId: sessionCartId,
        ...calcPrice([cartItem]),
      });
      // Then add to database
      await prisma.cart.create({
        data: newCart,
      });
    } else {
      // Check for existing item in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === cartItem.productId
      );
      // If not enough stock, throw error
      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // increase the qty of existing items
        (cart.items as CartItem[]).find(
          (x) => x.productId === cartItem.productId
        )!.qty = existItem.qty + 1;
      } else {
        // if stock, add item to cart
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(cartItem);
      }

      //Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart successfully`,
      };
    }

    //Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "item added to cart successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// so basically this function fetches the cart from the database using either the userId or the sessionCartId
export async function getMyCart() {
  // Check for session cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) {
    throw new Error("Cart session was not found");
  }

  // Get session and user Id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return {
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  };
}

// Remove item from cart in database
export async function removeItemFromCart (productId: string) {
  try{

    // the next two lines get the cart session if there is any
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if(!sessionCartId) throw new Error ("Cart Session was not found")

      //next get the product from the database
      const product = await prisma.product.findFirst({
        where: { id: productId}
      })
      if(!product) throw new Error ("Product was not found") 

      // next is to get the user cart
      const cart = await getMyCart()
      if(!cart) throw new Error ("cart not found")

      //check if the cart contains the item you want to remove from it
      const existItem = cart.items.find((item) => item.productId === productId)
      if(!existItem) throw new Error ("item not found in cart")

      // also decrease the qty if it is more than one or remove it totally if it is one
      if (existItem.qty === 1){
        cart.items = cart.items.filter((item) => item.productId !== existItem.productId)
      } else{
        cart.items.find((item) => item.productId === productId)!.qty = existItem.qty - 1   
      }

      // next step is to update the database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[])
        },
      });

      // next revalidate the page
      revalidatePath(`/product/${product.slug}`)
      
      // next return success and message
      return {
        sucess: true,
        message: `${product.name}  ${
          (cart.items as CartItem[]).find((x) => x.productId === productId)
            ? "updated in"
            : "removed from"
        } cart successfully`,
      };
       
  } catch (error){
    return {success: false, message: formatErrors(error)}
  }
}

export async function updateUserAdress(data: shippingAddress){
  try{
    const session = await auth()
    
    const currentUser = await prisma.user.findFirst({
      where: {id: session?.user?.id}
    })

    if (!currentUser){
      throw new Error("User not found")
    }

    const address = shippingAddressSchema.parse(data)
    
    await prisma.user.update({
      where: {id: currentUser.id},
      data: { address }
    })

    return({
      success: true,
      message: "User updated successfully"
    })
  } catch(error){
      return{
        success: false,
        message: formatErrors(error)
      }
  }
}