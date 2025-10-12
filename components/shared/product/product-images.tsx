"use client"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

const ProductImages = ({images}: {images: string[]}) => {

    const [current, setCurrent] = useState(0)
    return(
        <div className=" space-y-4">
            <Image src={images[current]} alt="product image" width={1000} height={1000} className=" min-h-[300px] object-cover object-center"/>
            <div className=" flex">
                {
                    images.map((image, index) => {
                        return (
                          <div
                            key={image}
                            className={cn(
                              "border  mr-2 cursor-pointer hover:border-orange-600",
                              current === index && "  border-orange-500"
                            )}
                            onClick={() => setCurrent(index)}
                          >
                            <Image
                              className=""
                              src={image}
                              width={100}
                              height={100}
                              alt="product image"
                            />
                          </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default ProductImages