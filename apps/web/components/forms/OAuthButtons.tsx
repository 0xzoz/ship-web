"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/Button";

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        type="button"
      >
        Sign in with Google
      </Button>
      <Button
        className="w-full"
        variant="secondary"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        type="button"
      >
        Sign in with GitHub
      </Button>
    </div>
  );
}
