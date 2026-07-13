import { SignIn } from '@clerk/clerk-react';
import { Logo } from '../../components/ui/Logo';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      
      <div className="relative z-10 text-center mb-8">
        <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-4">
          <Logo className="scale-125" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
        <p className="text-gray-400 mt-2 text-sm max-w-sm">
          Sign in with your authorized admin account to access the dashboard.
        </p>
      </div>

      <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
        <SignIn routing="path" path="/admin/login" forceRedirectUrl="/admin/dashboard" />
      </div>
    </div>
  );
}
