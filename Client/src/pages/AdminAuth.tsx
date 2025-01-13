import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { REGISTER_ADMIN, LOGIN_ADMIN } from '../graphql/mutations';
import { AuthForm } from '../components/AuthForm';

interface AdminAuthProps {
  setEmail: React.Dispatch<React.SetStateAction<string | null>>; 
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ setEmail }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [registerAdmin, { loading: registerLoading, error: registerError }] = useMutation(REGISTER_ADMIN);
  const [loginAdmin, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_ADMIN);

  const handleSubmit = async (data: any) => {
    setErrorMessage(null);

    try {
      if (isRegister) {
        await registerAdmin({
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
        const result = await loginAdmin({
          variables: {
            email: data.email,
            password: data.password,
          },
        });

        const token = result?.data?.loginAdmin?.token;
        const emailVerified = result?.data?.loginAdmin?.user?.emailVerified;
        const email = result?.data?.loginAdmin?.user?.email;
        setEmail(email)

        if (token) {
          localStorage.setItem('token', token);

          if (!emailVerified) {
            navigate('/verify-otp', { state: { email: data.email } });
          } else {
            navigate('/admin/dashboard');
          }
        } else {
          setErrorMessage('Login failed. Please try again.');
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
          {isRegister ? 'Create Admin Account' : 'Admin Login'}
        </h1>

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
