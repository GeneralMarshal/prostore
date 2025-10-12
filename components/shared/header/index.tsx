import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { ShoppingCartIcon, User } from "lucide-react";
import ModeToggle from "./mode-toggle";
import Menu from "./menu";

const Header = () => {
  return (
    <header className=" w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href={"/"} className="flex-start">
            <Image
              src={"/images/logo.svg"}
              priority={true}
              alt={`{APP_NAME} logo`}
              width={48}
              height={48}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        {/* <div className="space-x-2">
          <ModeToggle />
          <Button variant="ghost" asChild>
            <Link href={"/cart"}>
              <ShoppingCartIcon /> Cart
            </Link>
          </Button>
          <Button asChild>
            <Link href={"/sign-in"}>
              <ShoppingCartIcon /> Sign In
            </Link>
          </Button>
        </div> */}
        <Menu/>
      </div>
    </header>
  );
};
export default Header;
