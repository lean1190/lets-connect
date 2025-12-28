import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-8">
            Terms & Conditions
          </h1>

          {/* TL;DR Section */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-500 p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              TL;DR - Quick Summary
            </h2>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>
                • Let&apos;s Connect is a free service to help you stay in touch with your
                entrepreneurial circle
              </li>
              <li>
                • The app helps you organize and manage contacts you meet at events and networking
                opportunities
              </li>
              <li>• You are responsible for how you use the service and interact with others</li>
              <li>
                • We take no responsibility for misuse of the service or any consequences arising
                from its use
              </li>
              <li>• You can delete your account and data anytime</li>
              <li>• We may update these terms, and continued use means you accept them</li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              By accessing and using Let&apos;s Connect (&quot;the Service&quot;), you accept and
              agree to be bound by the terms and provision of this agreement. If you do not agree to
              abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              2. Description of Service and Intent
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              Let&apos;s Connect is a platform designed to help you organize and maintain
              connections with people you meet at entrepreneurial events, networking opportunities,
              and professional gatherings. The service allows you to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Store contact information and notes about people you meet</li>
              <li>Organize contacts into circles for better management</li>
              <li>Track the context and reason for each connection</li>
              <li>Access your network from any device</li>
            </ul>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              The service is provided free of charge. The intent of Let&apos;s Connect is to
              facilitate professional networking and relationship management within your
              entrepreneurial circle.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              As a user of Let&apos;s Connect, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Use the service only for legitimate professional networking purposes</li>
              <li>Respect the privacy and boundaries of others</li>
              <li>Not use the service for any illegal, harmful, or unauthorized purposes</li>
              <li>
                Not collect or store information about others without their knowledge or consent
              </li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              4. No Responsibility for Misuse
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              <strong>IMPORTANT:</strong> Let&apos;s Connect and its operators take no
              responsibility for misuse of the service. This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>
                Any unauthorized collection, storage, or use of personal information about others
              </li>
              <li>
                Harassment, stalking, or any form of unwanted contact facilitated through the
                service
              </li>
              <li>Spam, unsolicited communications, or misuse of contact information</li>
              <li>Any illegal activities conducted using the service</li>
              <li>Violation of privacy rights or data protection laws</li>
              <li>Any consequences arising from inappropriate or unethical use of the service</li>
            </ul>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              You are solely responsible for how you use Let&apos;s Connect and for ensuring your
              use complies with all applicable laws and ethical standards. We do not monitor,
              verify, or control how you use the information stored in the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              <strong>IMPORTANT:</strong> Let&apos;s Connect and its operators shall not be liable
              for any direct, indirect, incidental, special, consequential, or punitive damages,
              including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Any misuse of the service by users</li>
              <li>Unauthorized access to or disclosure of information</li>
              <li>Any interactions, relationships, or outcomes between users</li>
              <li>Service interruptions, data loss, or technical issues</li>
              <li>Financial losses or damages</li>
              <li>Legal consequences arising from misuse of the service</li>
            </ul>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              You use Let&apos;s Connect at your own risk. We are not responsible for the actions,
              behavior, or conduct of users or any consequences thereof.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              6. No Warranty
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              Let&apos;s Connect is provided &quot;as is&quot; without any warranties, express or
              implied. We do not guarantee the accuracy, reliability, or availability of the
              service. We make no representations about the suitability of the service for any
              particular purpose.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              7. User-Generated Content
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              You are solely responsible for any content you store or share through Let&apos;s
              Connect. You agree not to store inappropriate, offensive, or illegal content. We
              reserve the right to remove content and suspend accounts that violate these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              8. Privacy and Data
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              Your privacy is important to us. Please review our{' '}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Privacy Policy
              </Link>{' '}
              to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              9. Account Termination
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              You may delete your account at any time. We reserve the right to suspend or terminate
              accounts that violate these terms or engage in harmful behavior. Upon termination,
              your profile and data will be removed from our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              We may update these Terms & Conditions at any time. Continued use of Let&apos;s
              Connect after changes constitutes acceptance of the new terms. We will notify users of
              significant changes via email or through the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              If you have questions about these Terms & Conditions, please contact us at{' '}
              <a
                href="mailto:me@leanvilas.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                me@leanvilas.com
              </a>
              .
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-border">
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                Last updated: 28/12/2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
