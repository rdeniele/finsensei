'use client';

import { useState } from 'react';

interface TermsAndConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
  type: 'signup' | 'purchase';
}

export default function TermsAndConditions({ onAccept, onDecline, type }: TermsAndConditionsProps) {
  const [hasRead, setHasRead] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Terms and Conditions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Please read these terms carefully before proceeding
          </p>
        </div>
        
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-4">FinSensei Terms and Conditions</h3>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h4>
                <p>
                  By using FinSensei ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). 
                  If you do not agree to these Terms, do not use the Service. These Terms constitute a legally 
                  binding agreement between you and FinSensei.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Service Description</h4>
                <p>
                  FinSensei is a financial management and AI coaching service that provides:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Financial tracking and management tools</li>
                  <li>AI-powered financial coaching and advice</li>
                  <li>Coin-based system for accessing premium features</li>
                  <li>Educational content and resources</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibilities</h4>
                <p>You agree to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not attempt to circumvent any security measures</li>
                  <li>Not use the Service for any fraudulent or illegal activities</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Coin System and Purchases</h4>
                <p>
                  FinSensei uses a coin-based system for accessing AI coaching features:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Coins are virtual currency with no real-world monetary value</li>
                  <li>Coins are consumed at 20 coins per AI chat session</li>
                  <li>Daily free coins (20) are provided automatically</li>
                  <li>Additional coins can be purchased through our payment system</li>
                  <li>All coin purchases are final and non-refundable</li>
                  <li>Coins expire if not used within 365 days of purchase</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Payment Terms</h4>
                <p>
                  {type === 'purchase' && (
                    <>
                      By purchasing coins, you agree to:
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Pay the specified amount for your chosen coin package</li>
                        <li>Provide accurate payment information</li>
                        <li>Authorize the transaction for the full amount</li>
                        <li>Accept that all sales are final and non-refundable</li>
                      </ul>
                    </>
                  )}
                  Payment processing is handled by secure third-party providers. 
                  We do not store your payment information on our servers.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6. Disclaimers and Limitations</h4>
                <p>
                  <strong>IMPORTANT:</strong> FinSensei provides educational and informational content only. 
                  We are not financial advisors, and our advice should not be considered as professional 
                  financial guidance.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>All financial advice is for educational purposes only</li>
                  <li>We do not guarantee investment returns or financial outcomes</li>
                  <li>Users should consult qualified financial professionals for specific advice</li>
                  <li>We are not responsible for any financial losses or decisions made based on our content</li>
                  <li>The Service is provided "as is" without warranties of any kind</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">7. Limitation of Liability</h4>
                <p>
                  To the maximum extent permitted by law, FinSensei shall not be liable for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Any indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Financial losses resulting from use of our advice or tools</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Damages exceeding the amount paid for the Service in the past 12 months</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">8. Privacy and Data</h4>
                <p>
                  Your privacy is important to us. We collect and process data as described in our Privacy Policy. 
                  By using the Service, you consent to our data practices. We implement reasonable security 
                  measures but cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">9. Termination</h4>
                <p>
                  We may terminate or suspend your account at any time for violations of these Terms. 
                  You may cancel your account at any time. Upon termination, your access to the Service 
                  will cease immediately, and any unused coins will be forfeited.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">10. Changes to Terms</h4>
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective 
                  immediately upon posting. Your continued use of the Service constitutes acceptance 
                  of the modified Terms.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">11. Governing Law</h4>
                <p>
                  These Terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be 
                  resolved through binding arbitration, except for claims that may be brought in small 
                  claims court.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">12. Contact Information</h4>
                <p>
                  For questions about these Terms, please contact us at support@finsensei.com
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="read-terms"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="read-terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I have read and agree to the Terms and Conditions
            </label>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasRead}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 