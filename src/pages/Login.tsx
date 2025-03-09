
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();

  // Automatically redirect to dashboard
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  // This component will briefly show before redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Redirecting...</CardTitle>
          <CardDescription>
            Login has been disabled. Taking you to the dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Spinner or loading indicator */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-gray-500">
            This is a development environment with authentication disabled.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
