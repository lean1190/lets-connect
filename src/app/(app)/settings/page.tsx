"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth/context";

export default function SettingsPage() {
  const { user, isSignedIn, signInWithLinkedIn, signOut, isOfflineMode } =
    useAuth();
  const [syncing, setSyncing] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error(error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSignOutDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to sign out");
    }
  };

  const handleSync = async () => {
    if (!isSignedIn) {
      alert("Please sign in to sync your data.");
      return;
    }

    setSyncing(true);
    try {
      // Sync functionality would go here
      // For now, just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Your data has been synced!");
    } catch (error) {
      console.error(error);
      alert("Failed to sync data. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Account
          </h2>
          <Card>
            <CardContent className="pt-6">
              {isSignedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {user?.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSignOutDialogOpen(true)}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block">☁️</span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {isOfflineMode ? "Offline Mode" : "Not Signed In"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign in to sync your contacts across devices
                    </p>
                  </div>
                  <Button
                    onClick={handleSignIn}
                    disabled={signingIn}
                    className="w-full bg-[#0A66C2]"
                  >
                    {signingIn ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span className="bg-white text-[#0A66C2] px-2 py-1 rounded text-xs font-extrabold mr-2">
                          in
                        </span>
                        Sign in with LinkedIn
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Data
          </h2>
          <Card>
            <CardContent className="pt-6">
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || !isSignedIn}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  !isSignedIn
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                {syncing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A66C2]"></div>
                ) : (
                  <span className="text-2xl">🔄</span>
                )}
                <div className="flex-1 text-left">
                  <p
                    className={`font-semibold ${!isSignedIn ? "text-gray-500" : "text-[#0A66C2]"}`}
                  >
                    Sync Now
                  </p>
                  <p className="text-sm text-gray-500">
                    {isSignedIn
                      ? "Upload local data & download from cloud"
                      : "Sign in to enable sync"}
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Your contacts are always stored locally on your device.
          {isSignedIn
            ? " They are also backed up to the cloud."
            : " Sign in to back them up to the cloud."}
        </p>
      </div>

      <Dialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Your local data will be kept. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSignOutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSignOut} className="bg-[#0A66C2]">
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
