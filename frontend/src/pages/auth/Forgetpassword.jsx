import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function Forgetpassword() {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      console.log('Reset password email sent to:', email);
    }, 2000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Reset password email resent to:', email);
    }, 2000);
  };

  const handleBackToLogin = () => {
    console.log('Navigate back to login');
    // Handle navigation logic here
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">RojgariHub</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We've sent a password reset link to your email</p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Email Sent Successfully!
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to{' '}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">What's next?</p>
                    <p>Click the link in your email to reset your password. The link will expire in 15 minutes.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
                >
                  Back to Login
                </button>
                
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resending...' : 'Resend Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 RojgariHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (<>
  <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">RojgariHub</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Back to Login Link */}
            

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">How it works:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Enter your registered email address</li>
                    <li>• Check your inbox for a reset link</li>
                    <li>• Click the link to create a new password</li>
                    <li>• The link expires in 15 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Send Reset Link Button */}
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                email.trim() && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Still having trouble?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              Contact Support
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 RojgarigarHub. All rights reserved.</p>
        </div>
      </div>
    </div>
      <Footer/> </>
  );
}
