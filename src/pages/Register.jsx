import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/ui/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
      } else {
        // Also insert into customers table
        if (authData?.user) {
          await supabase.from('customers').insert({
            id: authData.user.id,
            email: data.email,
            name: `${data.firstName} ${data.lastName}`.trim(),
            role: 'user'
          });
        }
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading tracking-tight">Sign Up Account</h2>
          <p className="text-gray-500 text-sm">Enter your personal data to create your account.</p>
        </div>
        
        {authError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
              <input 
                type="text" 
                placeholder="First Name"
                {...register('firstName', { required: 'First name is required' })} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder-gray-400 bg-transparent"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
              <input 
                type="text" 
                placeholder="Last Name"
                {...register('lastName', { required: 'Last name is required' })} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder-gray-400 bg-transparent"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })} 
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
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-2 ml-1">Must contain at least 6 characters.</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#8B5CF6] text-white font-semibold py-4 px-4 rounded-2xl hover:bg-[#7C3AED] transition-all disabled:opacity-70 mt-6 shadow-sm shadow-[#8B5CF6]/30"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B5CF6] hover:text-[#7C3AED] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
