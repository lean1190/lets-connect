import { IconCircles, IconCloud, IconQrcode } from '@tabler/icons-react';
import { AnimateWhenVisible } from '@/components/animate-when-visible';

export function FeatureSection() {
  return (
    <AnimateWhenVisible>
      <section className="container mx-auto px-6 pt-8 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Build your network</h2>
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
              Instantly scan LinkedIn and WhatsApp QR codes to save contacts with context about why
              you connected.
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
    </AnimateWhenVisible>
  );
}
