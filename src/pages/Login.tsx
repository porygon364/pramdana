import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        if (session) {
          console.log('Existing session found:', session);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    handleLogin();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    console.log('Starting login process...');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase client:', !!supabase);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data?.user) {
        console.log('Login successful, user data:', data.user);
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          console.log('Email not confirmed');
          toast.error('Please confirm your email before logging in');
          return;
        }

        console.log('Email confirmed, proceeding to dashboard');
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      } else {
        console.log('No user data returned');
        toast.error('Login failed - no user data returned');
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email before logging in');
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Union</span>
        </Link>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    console.log('Email changed:', e.target.value);
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => {
                    console.log('Password changed, length:', e.target.value.length);
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => {
                  console.log('Button clicked');
                  handleLogin();
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
