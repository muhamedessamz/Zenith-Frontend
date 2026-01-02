import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft, Key, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'verify' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetCode, setResetCode] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/Auth/forgot-password', { email });
            // The backend returns the code in the response
            setResetCode(response.data.code || response.data.resetCode || '');
            setStep('verify');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Just move to password step without API call
        // The code will be verified when resetting password
        setStep('password');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/Auth/reset-password', {
                email,
                otpCode: code,  // Backend expects 'otpCode'
                newPassword: newPassword  // Backend expects 'NewPassword' but lowercase works
            });

            // Success - redirect to login
            navigate('/login', {
                state: { message: 'Password reset successfully! Please login with your new password.' }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setError('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setResetCode('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <Logo size={48} showText={true} />
                    </Link>
                    <h1 className="text-3xl font-display font-bold mt-6 mb-2">
                        {step === 'email' && 'Forgot Password?'}
                        {step === 'verify' && 'Verify Your Identity'}
                        {step === 'password' && 'Create New Password'}
                    </h1>
                    <p className="text-gray-600">
                        {step === 'email' && "No worries! Enter your email and we'll send you a reset code."}
                        {step === 'verify' && 'Enter the verification code to continue:'}
                        {step === 'password' && 'Enter your new password below:'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <>
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSendCode} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="you@example.com"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn btn-primary text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Send Reset Code
                                            <ArrowRight size={20} />
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <div className="flex gap-3">
                                    <Key size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-800 mb-1">
                                            How it works
                                        </p>
                                        <ul className="text-xs text-indigo-700 space-y-1">
                                            <li>• We'll send a verification code to your email</li>
                                            <li>• Enter the code to verify your identity</li>
                                            <li>• Set your new password</li>
                                            <li>• The code expires in 10 minutes</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2: Verify Code */}
                    {step === 'verify' && (
                        <>
                            {/* Code Display */}
                            {resetCode && (
                                <div className="mb-6 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-center animate-fadeIn">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                                        <Key size={32} className="text-indigo-600" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Your verification code:</p>
                                    <div className="text-4xl font-bold text-indigo-600 tracking-widest mb-2 font-mono">
                                        {resetCode}
                                    </div>
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-xs text-amber-800">
                                            ⏱️ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                {/* Verification Code Input */}
                                <div>
                                    <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="code"
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-mono text-lg tracking-widest text-center"
                                            placeholder="000000"
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full btn btn-primary text-base py-3"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Continue
                                        <ArrowRight size={20} />
                                    </span>
                                </button>

                                {/* Back Button */}
                                <button
                                    type="button"
                                    onClick={handleBackToEmail}
                                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    Use different email
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'password' && (
                        <>
                            {/* Success Icon */}
                            <div className="mb-6 text-center animate-fadeIn">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Code Verified!</h3>
                                <p className="text-sm text-gray-600">Now create your new password</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-5">
                                {/* New Password Input */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Enter new password"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-600">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn btn-primary text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Resetting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Reset Password
                                            <CheckCircle2 size={20} />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Back to Login */}
                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-sm text-gray-600 hover:text-gray-800 transition inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};
