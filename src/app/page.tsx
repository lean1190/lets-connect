import { IconCircles, IconCloud, IconQrcode } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CtaButton } from '@/components/ui/cta-button';
import { isSignedIn } from '@/lib/auth/session/isomorphic';
import { AppRoute } from '@/lib/constants/navigation';

export default async function LandingPage() {
  const isIn = await isSignedIn();
  const redirectTo = isIn ? AppRoute.Contacts : AppRoute.Signin;

  return (
    <div className="min-h-screen text-white bg-[#0e0f13] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0A66C2]/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#007AFF]/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo/transparent.png"
              alt="Let's Connect Logo"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            <div className="text-2xl font-bold">Let&apos;s Connect</div>
          </div>
          <Link href={redirectTo}>
            <Button variant="glass">{isIn ? 'Go to app' : 'Sign in'}</Button>
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stay in touch with your
              <span className="bg-gradient-to-r from-[#0A66C2] to-[#007AFF] bg-clip-text text-transparent">
                {' '}
                entrepreneurial circle
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              A simple way to keep track of the connections that matter.
            </p>
            <div className="flex justify-center">
              <CtaButton href={redirectTo} />
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="container mx-auto px-6 pt-8 pb-20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay in touch</h2>
            <p className="text-xl text-gray-400">
              Everything you need to maintain meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#0A66C2]/50 transition-all">
              <div className="w-14 h-14 bg-[#0A66C2]/20 rounded-lg flex items-center justify-center mb-6">
                <IconQrcode className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Scan & Connect</h3>
              <p className="text-gray-400 leading-relaxed">
                Instantly scan LinkedIn and WhatsApp QR codes to save contacts with context about
                why you connected.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#0A66C2]/50 transition-all">
              <div className="w-14 h-14 bg-[#0A66C2]/20 rounded-lg flex items-center justify-center mb-6">
                <IconCircles className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Organize Your Network</h3>
              <p className="text-gray-400 leading-relaxed">
                Organize your contacts in circles and add notes so you never forget the context of
                your connections.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#0A66C2]/50 transition-all">
              <div className="w-14 h-14 bg-[#0A66C2]/20 rounded-lg flex items-center justify-center mb-6">
                <IconCloud className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sync Everywhere</h3>
              <p className="text-gray-400 leading-relaxed">
                Access your network from any device. Your data is securely synced across all your
                devices.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/8 backdrop-blur-2xl rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl shadow-black/20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Build your entrepreneurial circle
              </h2>
              <p className="text-xl text-gray-300 mb-8">One person at a time</p>
              <CtaButton href={redirectTo} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">
              © {new Date().getFullYear()} Let&apos;s Connect. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
