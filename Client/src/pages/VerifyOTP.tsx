import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL, RESEND_VERIFICATION_EMAIL } from '../graphql/mutations';

interface VerifyOtpProps {
  email: string;
  onVerificationSuccess: () => void;
  onVerificationError: (message: string) => void;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ email, onVerificationSuccess, onVerificationError }) => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL);
  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(RESEND_VERIFICATION_EMAIL);

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!otp) {
      setErrorMessage('OTP is required.');
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage('OTP should be 6 digits.');
      return;
    }

    try {
      await verifyEmail({ variables: { otp, email } });
      onVerificationSuccess();
    } catch (err) {
      setErrorMessage('Invalid OTP or expired OTP. Please try again.');
      onVerificationError('OTP verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail({ variables: { email } });
      alert('Verification email sent! Please check your inbox.');
    } catch (err) {
      setErrorMessage('Failed to resend the verification email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP sent to your email
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            maxLength={6}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md mb-4"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {errorMessage && <p className="mt-4 text-red-600 text-center">{errorMessage}</p>}

        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="w-full bg-gray-600 text-white py-2 rounded-md"
        >
          {resendLoading ? 'Resending...' : 'Resend Verification Email'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
