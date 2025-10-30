import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href={"/sign-in"}>
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInital = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className=" flex gap-2 ites-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className=" flex items-center">
            <Button
              variant="ghost"
              className=" w-8 h-8 relative rounded-full ml-2 flex items-center justify-center bg-gray-300"
            >
              {firstInital}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                        {session.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                        {session.user?.email}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-0 mb-1">
                <form action={signOutUser} className="w-full">
                    <Button className=" w-full px-2 py-4 h-4 justify-start" variant="ghost">
                        Sign Out
                    </Button>
                </form>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
