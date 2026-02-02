import BackButton from '../components/layouts/buttons/back-button';

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-black relative">
      <div className="absolute top-4 left-4 z-20">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
