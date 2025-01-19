"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { MsmeList } from "@/components/msme/msme-list";
import { Navbar } from "@/components/navbar";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  const LoginForm = () => (
    <Card className="p-6 w-full shadow-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-6">Log In</h2>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <Button className="w-full bg-black text-white hover:bg-black/90" size="lg">
                Sign In to Factoryspace
                <span className="ml-2">→</span>
              </Button>
            </SignInButton>

            <div className="flex flex-col items-center gap-2 text-sm mt-4">
              <SignUpButton mode="modal">
                <button className="text-primary hover:underline">
                  Register Now
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
       <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="min-h-screen w-full">
        <Navbar />

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
          {/* {isLoaded && ( */}
            <div className="flex flex-1 justify-center items-center flex-col md:flex-row">
              <div className="flex-1 flex items-center justify-center">
                {/* Left side content */}
                <div className="max-w-xl py-20 w-full">
                  <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                    Your Manufacturing Cloud
                  </h2>
                  <h1 className="md:text-5xl text-white text-4xl font-bold leading-tight mb-6">
                    Build, Scale, and Innovate—Without Owning a Single Machine
                  </h1>
                  <p className="md:text-lg text-base text-muted-foreground mb-8 leading-relaxed">
                    Imagine building anything, without limits—no machines to buy, no complexity to manage.
                    Factory Space gives you instant access to a world of manufacturing, ready when you are.
                    Build what you dream of, simply and effortlessly.
                  </p>
                  {/* {isSignedIn ? <div></div> : <SignUpButton mode="modal">
                    <Button className="bg-white text-black hover:bg-white/90" size="lg">
                      Start Building Now
                    </Button>
                  </SignUpButton>} */}
                </div>
              </div>

              {/* Right side */}
              <div className="w-full max-w-[440px] flex items-center justify-center md:p-0 p-8">
                <MsmeList />
              </div>
            </div>
          {/* )} */}
        </main>
      </div>
    </div>
  );
}
