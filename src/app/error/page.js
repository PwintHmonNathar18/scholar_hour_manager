'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const errorType = searchParams.get('error');
    
    switch (errorType) {
      case 'Configuration':
        setError('There is a problem with the server configuration.');
        break;
      case 'AccessDenied':
        setError('Access denied. You do not have permission to sign in.');
        break;
      case 'Verification':
        setError('The verification token has expired or has already been used.');
        break;
      case 'CredentialsSignin':
        setError('Invalid email or password. Please try again.');
        break;
      default:
        setError('An unexpected error occurred during authentication.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <a
              href="/scholar-hour-manager/signin"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </a>
          </div>
          
          <div className="text-center">
            <a
              href="/scholar-hour-manager"
              className="text-blue-600 hover:text-blue-500"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
