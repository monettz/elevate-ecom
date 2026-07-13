import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="mb-8 hover:opacity-90 transition-opacity">
        <Logo className="scale-125" />
      </Link>
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </div>
  );
}
