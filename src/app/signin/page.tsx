import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CtaButton } from '@/components/ui/cta-button';
import { isSignedIn } from '@/lib/auth/session/server';
import { signInWithLinkedIn } from '@/lib/auth/signin';
import { AppRoute } from '@/lib/constants/navigation';

export default async function SigninPage() {
  if (await isSignedIn()) {
    return redirect(AppRoute.Contacts);
  }

  return (
    <div className="min-h-dvh text-white bg-[#0e0f13] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0A66C2]/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#007AFF]/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative min-h-dvh flex flex-col">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8 flex justify-start">
          <Link href={AppRoute.Landing}>
            <Button variant="glass">← This way back</Button>
          </Link>
        </nav>

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 pt-2 border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
              {/* Liquid glass shine effect */}
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

              <div className="relative text-center">
                <div className="flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="Let's Connect Logo"
                    width={160}
                    height={160}
                    className="w-40 h-40"
                    quality={100}
                    priority
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Let&apos;s Connect
                </h1>
                <p className="text-base text-gray-300 leading-relaxed mb-8">
                  Keep track of the people you meet at events
                </p>

                <form action={signInWithLinkedIn} className="pt-4">
                  <CtaButton type="submit" size="lg" className="w-full">
                    <span className="hidden sm:inline-block bg-white text-blue-400 px-2.5 py-1 rounded text-xs font-extrabold leading-none tracking-tight">
                      in
                    </span>
                    Sign in with LinkedIn
                  </CtaButton>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By signing up you accept the{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                    Terms and Conditions
                  </Link>
                  , and the{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
