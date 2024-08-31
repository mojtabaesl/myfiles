import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

interface Props {}

export const Header = (props: Props) => {
  return (
    <header className="border-b bg-gray-50 py-4">
      <div className="container flex justify-between items-center">
        <div>File Drive</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};
