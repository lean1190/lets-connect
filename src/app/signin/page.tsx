import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isSignedIn } from '@/lib/auth/session/isomorphic';
import { signInWithLinkedIn } from '@/lib/auth/signin';
import { AppRoute } from '@/lib/constants/navigation';

export default async function SigninPage() {
  if (await isSignedIn()) {
    redirect(AppRoute.Contacts);
  }

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
            <p className="text-white font-medium">Add notes about why to connect</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <span className="text-2xl">☁️</span>
            <p className="text-white font-medium">Sync across devices with sign-in</p>
          </div>
        </div>

        <form action={signInWithLinkedIn} className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-white text-[#0A66C2] hover:bg-white/90 h-14 text-lg font-semibold"
          >
            Sign in with LinkedIn
          </Button>
        </form>
      </div>
    </div>
  );
}
