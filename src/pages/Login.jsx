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

          <div className="flex items-center mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
              <span className="text-sm text-gray-700 font-medium">Remember me</span>
            </label>
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
