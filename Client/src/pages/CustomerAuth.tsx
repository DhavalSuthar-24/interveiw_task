import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { REGISTER_CUSTOMER, LOGIN_CUSTOMER } from '../graphql/mutations';
import { AuthForm } from '../components/AuthForm';

interface CustomerAuthProps {
  setEmail: React.Dispatch<React.SetStateAction<string | null>>; // Accept setEmail function
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({ setEmail }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [registerCustomer, { loading: registerLoading, error: registerError }] = useMutation(REGISTER_CUSTOMER);
  const [loginCustomer, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_CUSTOMER);

  const handleSubmit = async (data: any) => {
    setErrorMessage(null);

    try {
      if (isRegister) {
        const result = await registerCustomer({
          variables: {
            input: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: data.password,
            },
          },
        });

        setEmail(data.email);
        navigate('/verify-otp');
      } else {
        const result = await loginCustomer({
          variables: {
            email: data.email,
            password: data.password,
          },
        });

        const token = result?.data?.loginCustomer?.token;

        const emailVerified = result?.data?.loginCustomer?.user?.emailVerified;
        if (token) {
          localStorage.setItem('token', token);
          if (!emailVerified) {
            navigate('/verify-otp', { state: { email: data.email } });
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isRegister ? 'Create Customer Account' : 'Customer Login'}
        </h1>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <AuthForm
          isRegister={isRegister}
          onSubmit={handleSubmit}
          isLoading={registerLoading || loginLoading}
          error={registerError?.message || loginError?.message || errorMessage}
        />

        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};
