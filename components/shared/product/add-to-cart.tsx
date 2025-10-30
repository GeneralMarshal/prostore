"use client"

import { Cart, CartItem } from "@/types"
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { useTransition } from "react";


const AddToCart = ({item, cart}: {
    item: CartItem
    cart?: Cart
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition()

    const handleRemoveFromCart = async () => {
        startTransition( async() => {
            const res = await removeItemFromCart(item.productId);

            toast({
              variant: res.sucess ? "default" : "destructive",
              description: res.message,
            });

            return;
        })
    }

    const handleAddToCart = async () => {
        startTransition( async () => {
          //server action to add item to cart
          const res = await addItemToCart(item);

          if (!res.success) {
            toast({
              variant: "destructive",
              description: res.message,
            });
          }

          toast({
            description: res.message,
            action: (
              <ToastAction
                className=" bg-primary text-white hover:bg-gray-800"
                onClick={() => router.push("/cart")}
                altText="Go to cart"
              >
                Go to Cart
              </ToastAction>
            ),
          });
        })
    }

    const existItem = cart?.items.find((x) => x.productId === item.productId)

    return existItem ? (
      <div>
        <Button
          variant={"outline"}
          type="button"
          onClick={handleRemoveFromCart}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="w-4 h-4  animate-spin" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>
        <span className="px-2">{existItem.qty}</span>
        <Button
          variant={"outline"}
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="w-4 h-4  animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    ) : (
      <Button className="w-full" type="button" onClick={handleAddToCart} disabled={isPending}>
        {isPending ? (
            <Loader className="w-4 h-4  animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        Add To Cart
      </Button>
    );
}

export default AddToCart