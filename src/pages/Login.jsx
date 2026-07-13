import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/ui/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-sm overflow-hidden p-8 sm:p-10">
        
        {/* Header Section */}
        <div className="mb-10">
          <Link to="/" className="inline-block mb-8 hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading tracking-tight">Welcome Back!</h2>
          <p className="text-gray-500 text-sm">Enter your login information</p>
        </div>
        
        {authError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center">
            {authError}
          </div>
        )}

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.365 21.43c-1.39.95-2.82.95-4.13 0-1.42-.98-3.66-3.48-5.35-7.3-1.74-3.92-1.34-7.51.98-9.52 1.39-1.2 3.19-1.37 4.54-.7 1.05.52 2.01.52 3.03 0 1.48-.74 3.4-.48 4.67.75-2.61 1.4-2.22 5.09.68 6.42-1.02 2.68-2.66 5.8-4.42 10.35zm-2.83-16.7c-.82-.87-1.33-2.09-1.16-3.32 1.15.06 2.45.68 3.32 1.57.77.78 1.34 2.02 1.14 3.25-1.28.11-2.52-.61-3.3-1.5z"/></svg>
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="Email Address"
              {...register('email', { required: 'Email is required' })} 
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder-gray-400 bg-transparent"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                {...register('password', { required: 'Password is required' })} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder-gray-400 bg-transparent pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <Eye size={20} strokeWidth={1.5} /> : <EyeOff size={20} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
              <span className="text-sm text-gray-700 font-medium">Remember me</span>
            </label>
            <Link to="#" className="text-sm font-semibold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#8B5CF6] text-white font-semibold py-4 px-4 rounded-2xl hover:bg-[#7C3AED] transition-all disabled:opacity-70 mt-6 shadow-sm shadow-[#8B5CF6]/30"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8B5CF6] hover:text-[#7C3AED] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
