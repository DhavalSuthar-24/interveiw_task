import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { client } from './lib/apollo-client';
import { CustomerAuth } from './pages/CustomerAuth';
import { AdminAuth } from './pages/AdminAuth';
import { LogIn } from 'lucide-react';
import VerifyOtp from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';

function App() {
  const [email, setEmail] = useState<string | null>(null);

  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    return token !== null;
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-8">Welcome</h1>
                    <div className="space-y-4">
                      <Link
                        to="/customer"
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <LogIn size={20} />
                        Customer Portal
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        <LogIn size={20} />
                        Admin Portal
                      </Link>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/customer"
              element={<CustomerAuth setEmail={setEmail} />}
            />
            <Route
              path="/admin"
              element={<AdminAuth setEmail={setEmail} />}
            />
            <Route
              path="/verify-otp"
              element={
                email && (
                  <VerifyOtp
                    email={email}
                    onVerificationSuccess={() => window.location.href = '/dashboard'}
                    onVerificationError={(message) => alert(message)}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated() ? (
                 <Dashboard/>
                ) : (
                  <Navigate to="/customer" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
