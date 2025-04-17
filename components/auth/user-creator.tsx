"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserCreator() {
  const { isSignedIn, isLoaded } = useAuth();  

  useEffect(() => {
    const createUser = async () => {
      try {
        await fetch("/api/auth/create-user", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    if (isLoaded && isSignedIn) {
      createUser();
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
