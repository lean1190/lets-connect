export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-8">
            Privacy Policy
          </h1>

          {/* TL;DR Section */}
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 dark:border-green-500 p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              TL;DR - Quick Summary
            </h2>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>
                • We collect only the information you provide (name, email, contact information you
                store)
              </li>
              <li>
                • Your data is used solely to provide the contact management and networking features
              </li>
              <li>
                • We don&apos;t sell, rent, or share your personal information with third parties
              </li>
              <li>• You can delete your account and data anytime</li>
              <li>• We use secure databases and follow industry best practices</li>
              <li>• We may send you emails about service updates</li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              We collect information you voluntarily provide when using Let&apos;s Connect:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address (from LinkedIn
                authentication)
              </li>
              <li>
                <strong>Contact Information:</strong> Information about contacts you choose to store
                (names, profile links, reasons for connecting, notes)
              </li>
              <li>
                <strong>Organization Data:</strong> Circles you create, group memberships, and
                organizational structures
              </li>
              <li>
                <strong>Settings:</strong> Theme preferences, QR code links, and other app settings
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with the service (anonymized for
                analytics)
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              We use your information solely to provide and improve the Let&apos;s Connect service:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Store and organize your contact information</li>
              <li>Enable you to manage your entrepreneurial network</li>
              <li>Sync your data across devices</li>
              <li>Provide search and filtering capabilities</li>
              <li>Improve our service quality and user experience</li>
              <li>Provide customer support when needed</li>
              <li>Send service-related notifications (if applicable)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              <strong>
                We do not sell, rent, or share your personal information with third parties.
              </strong>{' '}
              We only share information in these limited circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> We use trusted third-party services (like
                database hosting, authentication providers) that help us operate the service. These
                providers are bound by confidentiality agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law or to protect our rights and
                safety
              </li>
            </ul>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              <strong>Important:</strong> The contact information you store in Let&apos;s Connect is
              private to your account. We do not share it with other users or third parties. You are
              responsible for ensuring you have the right to store and use any contact information
              you enter into the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Data is encrypted in transit and at rest</li>
              <li>Access to personal data is limited to authorized personnel only</li>
              <li>We use secure, industry-standard databases and hosting services</li>
              <li>Regular security audits and updates</li>
              <li>Authentication through secure providers (LinkedIn OAuth)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              5. Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-4">
              You have control over your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>
                <strong>Access:</strong> You can view and update your information anytime through
                the app
              </li>
              <li>
                <strong>Deletion:</strong> You can delete your account and all associated data at
                any time
              </li>
              <li>
                <strong>Data Portability:</strong> You can export your contact information through
                the app interface
              </li>
              <li>
                <strong>Correction:</strong> You can update or correct any information you have
                stored
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              We use minimal cookies and tracking technologies to improve your experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Essential cookies for authentication and basic functionality</li>
              <li>Analytics to understand how the service is used (anonymized)</li>
              <li>No advertising or third-party tracking cookies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              We retain your information only as long as necessary:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-muted-foreground mb-6 space-y-2">
              <li>Active accounts: Data is kept while your account is active</li>
              <li>Deleted accounts: Data is permanently removed within 30 days</li>
              <li>Legal requirements: Some data may be retained longer if required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              Let&apos;s Connect is intended for users 18 years and older. We do not knowingly
              collect personal information from children under 18. If we become aware that we have
              collected such information, we will take steps to delete it promptly.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              9. International Users
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              If you&apos;re using Let&apos;s Connect from outside Germany, please note that your
              information may be transferred to and processed in Germany. By using our service, you
              consent to this transfer.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any
              significant changes via email or through the service. Continued use of Let&apos;s
              Connect after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-muted-foreground mb-6">
              If you have questions about this Privacy Policy or how we handle your information,
              please contact us at{' '}
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
