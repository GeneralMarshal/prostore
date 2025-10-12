"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";

const NotFound = () => {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <Image
        src={"/images/logo.svg"}
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
      ></Image>
      <div className=" p-6 rounded-lg shadow-md w-1/3 text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">
          Could not find the requested resource
        </p>
        <Button variant="outline" className="mt-4 ml-2">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
