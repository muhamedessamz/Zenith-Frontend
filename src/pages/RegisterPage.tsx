import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/Logo';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
        if (!/[0-9]/.test(password)) errors.push('One number');
        if (!/[!@#$%^&*]/.test(password)) errors.push('One special character (!@#$%^&*)');
        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation errors when user types
        if (name === 'password') {
            setValidationErrors(validatePassword(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccess(false);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationErrors(['Passwords do not match']);
            return;
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setValidationErrors(passwordErrors);
            return;
        }

        if (!acceptTerms) {
            setValidationErrors(['You must accept the terms and conditions']);
            return;
        }

        setValidationErrors([]);

        const success = await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
        });

        if (success) {
            setSuccess(true);

            // Redirect to verify email page after 2 seconds
            setTimeout(() => {
                navigate('/verify-email', { state: { email: formData.email } });
            }, 2000);
        }
        // Error is already set in the store and will be displayed
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-2xl relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <Logo size={48} showText={true} />
                    </Link>
                    <h1 className="text-3xl font-display font-bold mt-6 mb-2">Create Your Account</h1>
                    <p className="text-gray-600">Join Zenith and reach the peak of productivity</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Account created successfully!</p>
                                <p className="text-xs text-green-600 mt-1">Redirecting to email verification...</p>
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

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fadeIn">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-800 mb-2">Please fix the following:</p>
                                    <ul className="text-xs text-amber-700 space-y-1">
                                        {validationErrors.map((err, index) => (
                                            <li key={index}>• {err}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Ahmed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Mohamed"
                                    />
                                </div>
                            </div>
                        </div>

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
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => {
                                            const strength = 4 - validationErrors.length;
                                            return (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= strength
                                                        ? strength === 4
                                                            ? 'bg-green-500'
                                                            : strength === 3
                                                                ? 'bg-cyan-500'
                                                                : strength === 2
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-red-500'
                                                        : 'bg-gray-200'
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password strength: {
                                            validationErrors.length === 0 ? 'Strong' :
                                                validationErrors.length <= 2 ? 'Good' :
                                                    validationErrors.length <= 3 ? 'Fair' : 'Weak'
                                        }
                                    </p>
                                </div>
                            )}
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
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer mt-1"
                            />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer">
                                I agree to the{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full btn btn-primary text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </span>
                            ) : success ? (
                                <span className="flex items-center justify-center gap-2">
                                    <CheckCircle2 size={20} />
                                    Account Created!
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account
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
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Sign Up */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-secondary py-3 text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="btn btn-secondary py-3 text-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>

                {/* Sign In Link */}
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition">
                        Sign in
                    </Link>
                </p>

                {/* Back to Home */}
                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};
