"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "@/lib/auth/context";

function SignInContent() {
  const { signInWithLinkedIn, skipSignIn, isLoading, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isSignedIn) {
    router.push("/contacts");
    return null;
  }

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A66C2] flex items-center justify-center p-8">
      <div className="max-w-md w-full flex flex-col justify-between min-h-[80vh] py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            Let&apos;s Connect
          </h1>
          <p className="text-xl text-white/85 leading-relaxed">
            Keep track of the people you meet at events
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <span className="text-2xl">📱</span>
            <p className="text-white font-medium">Scan LinkedIn QR codes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <span className="text-2xl">📝</span>
            <p className="text-white font-medium">
              Add notes about why to connect
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <span className="text-2xl">☁️</span>
            <p className="text-white font-medium">
              Sync across devices with sign-in
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleLinkedInSignIn}
            disabled={loading || isLoading}
            className="w-full bg-white text-[#0A66C2] hover:bg-white/90 h-14 text-lg font-semibold"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A66C2]"></div>
            ) : (
              <>
                <span className="bg-[#0A66C2] text-white px-2 py-1 rounded text-sm font-extrabold mr-2">
                  in
                </span>
                Sign in with LinkedIn
              </>
            )}
          </Button>

          <Button
            onClick={skipSignIn}
            disabled={loading || isLoading}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10 h-14 text-base font-medium"
          >
            Continue without signing in
          </Button>

          <p className="text-white/60 text-sm text-center mt-4">
            Without signing in, your contacts will only be stored on this device
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignInContent />
    </AuthProvider>
  );
}
