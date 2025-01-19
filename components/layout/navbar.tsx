"use client";

import { Button } from "@/components/ui/button";
// import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  // const { isSignedIn } = useAuth();

  return (
    <header className="w-full py-4 border-b border-gray-700 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-semibold text-xl">FactorySpace</span>
        </div>
{/* 
        <div className="flex items-center gap-6">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="text-black" variant="outline" size="sm">
                  Register
                </Button>
              </SignUpButton>
            </>
          )}
        </div> */}
      </div>
    </header>
  );
}
