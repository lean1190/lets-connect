export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          {/* TL;DR Section */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 mb-3">TL;DR - Quick Summary</h2>
            <ul className="text-green-800 space-y-2">
              <li>
                • We collect only the information you provide (name, email, gym, schedule, fitness
                goals)
              </li>
              <li>• Your data is used solely to match you with compatible workout partners</li>
              <li>• We don't sell, rent, or share your personal information with third parties</li>
              <li>• You can delete your account and data anytime</li>
              <li>• We use secure databases and follow industry best practices</li>
              <li>• We may send you emails about matches and service updates</li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you voluntarily provide when creating your PushPal profile:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address
              </li>
              <li>
                <strong>Fitness Information:</strong> Age, gender, fitness level, goals, bio
              </li>
              <li>
                <strong>Location Information:</strong> Gym location and workout schedule
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with the service, matches made,
                feedback provided
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use your information solely to provide and improve the PushPal service:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Match you with compatible workout partners</li>
              <li>Send you notifications about potential matches</li>
              <li>Facilitate communication between matched users</li>
              <li>Send follow-up emails to check on meeting outcomes</li>
              <li>Improve our matching algorithms and service quality</li>
              <li>Provide customer support when needed</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              <strong>
                We do not sell, rent, or share your personal information with third parties.
              </strong>{' '}
              We only share information in these limited circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>
                <strong>With Matched Users:</strong> When you're matched with someone, they can see
                your name, fitness level, goals, and bio
              </li>
              <li>
                <strong>Service Providers:</strong> We use trusted third-party services (like email
                providers) that help us operate the service
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law or to protect our rights and
                safety
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Data is encrypted in transit and at rest</li>
              <li>Access to personal data is limited to authorized personnel only</li>
              <li>We use secure, industry-standard databases and hosting services</li>
              <li>Regular security audits and updates</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">You have control over your personal information:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>
                <strong>Access:</strong> You can view and update your profile information anytime
              </li>
              <li>
                <strong>Deletion:</strong> You can delete your account and all associated data
              </li>
              <li>
                <strong>Communication:</strong> You can opt out of non-essential emails
              </li>
              <li>
                <strong>Data Portability:</strong> You can request a copy of your data
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-6">
              We use minimal cookies and tracking technologies to improve your experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Essential cookies for basic functionality</li>
              <li>Analytics to understand how the service is used (anonymized)</li>
              <li>No advertising or third-party tracking cookies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-6">
              We retain your information only as long as necessary:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Active accounts: Data is kept while your account is active</li>
              <li>Deleted accounts: Data is permanently removed within 30 days</li>
              <li>Legal requirements: Some data may be retained longer if required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              PushPal is intended for users 18 years and older. We do not knowingly collect personal
              information from children under 18. If we become aware that we have collected such
              information, we will take steps to delete it promptly.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Users</h2>
            <p className="text-gray-700 mb-6">
              If you're using PushPal from outside the Germany, please note that your information
              may be transferred to and processed in the Germany. By using our service, you consent
              to this transfer.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any
              significant changes via email or through the service. Continued use of PushPal after
              changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have questions about this Privacy Policy or how we handle your information,
              please contact us through the feedback mechanisms provided in the app.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">Last updated: 28/09/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
