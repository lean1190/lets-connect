import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms & Conditions
          </h1>

          {/* TL;DR Section */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              TL;DR - Quick Summary
            </h2>
            <ul className="text-blue-800 space-y-2">
              <li>• PushPal is a free service that connects gym buddies</li>
              <li>
                • We match you with potential workout partners based on your
                preferences
              </li>
              <li>
                • You're responsible for your own safety and interactions with
                other users
              </li>
              <li>
                • We're not liable for any issues that arise from using our
                service
              </li>
              <li>• You can delete your account anytime</li>
              <li>
                • We may update these terms, and continued use means you accept
                them
              </li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6">
              By accessing and using PushPal ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by the above, please do not use this
              service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-6">
              PushPal is a platform that connects individuals seeking workout
              partners at gyms. We facilitate introductions between users based
              on shared gym locations, schedules, and fitness goals. The service
              is provided free of charge.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              As a user of PushPal, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Provide accurate and truthful information in your profile</li>
              <li>Respect other users and maintain appropriate conduct</li>
              <li>Meet in public places for initial meetings</li>
              <li>Take responsibility for your own safety and well-being</li>
              <li>Not use the service for any illegal or harmful purposes</li>
              <li>Respect the privacy and boundaries of other users</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>IMPORTANT:</strong> PushPal and its operators shall not be
              liable for any direct, indirect, incidental, special,
              consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>
                Personal injuries or accidents that occur during or after
                meetings arranged through the service
              </li>
              <li>Property damage or theft</li>
              <li>Emotional distress or psychological harm</li>
              <li>Financial losses or damages</li>
              <li>
                Any interactions, relationships, or outcomes between users
              </li>
              <li>Service interruptions, data loss, or technical issues</li>
            </ul>
            <p className="text-gray-700 mb-6">
              You use PushPal at your own risk. We are not responsible for the
              actions, behavior, or conduct of other users.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. No Warranty
            </h2>
            <p className="text-gray-700 mb-6">
              PushPal is provided "as is" without any warranties, express or
              implied. We do not guarantee the accuracy, reliability, or
              availability of the service. We make no representations about the
              suitability of matches or the success of any connections made
              through our platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. User-Generated Content
            </h2>
            <p className="text-gray-700 mb-6">
              You are solely responsible for any content you share through
              PushPal. You agree not to share inappropriate, offensive, or
              illegal content. We reserve the right to remove content and
              suspend accounts that violate these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Privacy and Data
            </h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Account Termination
            </h2>
            <p className="text-gray-700 mb-6">
              You may delete your account at any time. We reserve the right to
              suspend or terminate accounts that violate these terms or engage
              in harmful behavior. Upon termination, your profile and data will
              be removed from our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-6">
              We may update these Terms & Conditions at any time. Continued use
              of PushPal after changes constitutes acceptance of the new terms.
              We will notify users of significant changes via email or through
              the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-700 mb-6">
              If you have questions about these Terms & Conditions, please
              contact us through the feedback mechanisms provided in the app.
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
