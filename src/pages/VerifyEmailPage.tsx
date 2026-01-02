import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../lib/axios';

export const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        const lastInput = document.getElementById(`code-${lastIndex}`);
        lastInput?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/Auth/verify-email', {
                email,
                otpCode: verificationCode,
            });

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login', { state: { message: 'Email verified! Please sign in.' } });
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        setResendSuccess(false);
        setError('');

        try {
            await api.post('/Auth/resend-verification', { email });
            setResendSuccess(true);
            setCountdown(60); // 60 seconds cooldown

            setTimeout(() => setResendSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (code.every(digit => digit !== '') && !isLoading) {
            handleSubmit(new Event('submit') as any);
        }
    }, [code]);

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
                    <h1 className="text-3xl font-display font-bold mt-6 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600">
                        We've sent a 6-digit code to
                        <br />
                        <span className="font-semibold text-gray-800">{email || 'your email'}</span>
                    </p>
                </div>

                {/* Verification Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Email verified successfully!</p>
                                <p className="text-xs text-green-600 mt-1">Redirecting to login...</p>
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

                    {/* Resend Success */}
                    {resendSuccess && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                            <Mail size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">Code sent successfully!</p>
                                <p className="text-xs text-blue-600 mt-1">Check your email inbox</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                                Enter Verification Code
                            </label>
                            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                        disabled={isLoading || success}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || success || code.some(d => !d)}
                            className="w-full btn btn-primary text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </span>
                            ) : success ? (
                                <span className="flex items-center justify-center gap-2">
                                    <CheckCircle2 size={20} />
                                    Verified!
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Verify Email
                                    <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Resend Code */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || countdown > 0}
                            className="btn btn-ghost text-sm disabled:opacity-50"
                        >
                            {resendLoading ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={16} className="animate-spin" />
                                    Sending...
                                </span>
                            ) : countdown > 0 ? (
                                <span>Resend in {countdown}s</span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={16} />
                                    Resend Code
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                    </div>

                    {/* Email Icon */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 mb-3">
                            <Mail size={32} className="text-indigo-600" />
                        </div>
                        <p className="text-xs text-gray-500">
                            Check your spam folder if you don't see the email
                        </p>
                    </div>
                </div>

                {/* Back to Register */}
                <div className="text-center mt-6">
                    <Link to="/register" className="text-sm text-gray-500 hover:text-gray-700 transition">
                        ← Back to registration
                    </Link>
                </div>
            </div>
        </div>
    );
};
