import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminVerify() {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const navigate = useNavigate();
  const { isSignedIn, verifyAdminSecret, signOut } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/admin/login');
    }
  }, [isSignedIn, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: isValid, error: rpcError } = await supabase.rpc('verify_admin_secret', { input_secret: secretKey });
      
      if (rpcError) throw rpcError;

      if (isValid) {
        verifyAdminSecret();
        navigate('/admin/dashboard');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          await signOut();
          navigate('/');
        } else {
          setError(`Invalid Secret Key. ${3 - newAttempts} attempts remaining.`);
          setSecretKey('');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying secret key. Ensure the backend function is deployed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-sm overflow-hidden p-8 sm:p-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading tracking-tight">Security Check</h2>
          <p className="text-gray-500 text-sm">Please enter the Admin Secret Key to proceed.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Secret Key</label>
            <div className="relative">
              <input 
                type="password" 
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter Secret Key"
                required
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder-gray-400 bg-transparent pr-12"
              />
              <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !secretKey}
            className="w-full bg-red-600 text-white font-semibold py-4 px-4 rounded-2xl hover:bg-red-700 transition-all disabled:opacity-70 mt-6 shadow-sm shadow-red-600/30"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
