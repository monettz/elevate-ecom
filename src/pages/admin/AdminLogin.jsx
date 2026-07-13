import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Logo } from '../../components/ui/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Check role
      const { data: customerData } = await supabase
        .from('customers')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (customerData?.role === 'admin' || customerData?.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        await supabase.auth.signOut();
        setAuthError('Unauthorized: Admin access required.');
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
        <div className="mb-10 text-center">
          <div className="inline-block mb-8">
            <Logo className="scale-125" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 text-sm">Enter your admin credentials</p>
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
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z" fill="#000000"/></svg>
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Email</label>
            <input 
              type="email" 
              placeholder="Admin Email"
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
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          <Link to="/" className="text-[#8B5CF6] hover:text-[#7C3AED] hover:underline">
            &larr; Return to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
