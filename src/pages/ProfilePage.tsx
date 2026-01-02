import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { ProfilePictureUpload } from '../components/ProfilePictureUpload';
import {
    User,
    Mail,
    Lock,
    Save,
    Eye,
    EyeOff,
    CheckCircle,

    XCircle,
    CreditCard
} from 'lucide-react';
import api from '../lib/axios';

export const ProfilePage = () => {
    const { user, logout, refreshSession } = useAuthStore();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>('Pro');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


    // Profile form
    const [profileData, setProfileData] = useState({
        username: user?.displayName || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
    });

    // Original data for cancel
    const [originalData, setOriginalData] = useState({
        username: user?.displayName || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });





    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await api.put('/User/profile', {
                username: profileData.username,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email
            });

            // Refresh user session to get updated data
            await refreshSession();

            // Update original data
            setOriginalData(profileData);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        // Check if new password is same as current password
        if (passwordData.currentPassword === passwordData.newPassword) {
            setMessage({ type: 'error', text: 'New password must be different from current password' });
            setLoading(false);
            return;
        }

        try {
            await api.put('/User/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setMessage({
                type: 'success',
                text: 'Password changed successfully! Redirecting to login...'
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Logout and redirect to login after 2 seconds
            setTimeout(() => {
                logout();
                navigate('/login', {
                    state: { message: 'Password changed successfully! Please login with your new password.' }
                });
            }, 2000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    // const getPasswordStrength = (password: string) => {
    //     if (password.length === 0) return { strength: 0, label: '', color: '' };
    //     if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    //     if (password.length < 10) return { strength: 2, label: 'Medium', color: 'bg-amber-500' };
    //     return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    // };
    // const getInitials = () => {
    //     if (user?.firstName && user?.lastName) {
    //         return `${user.firstName[0]}${user.lastName[0]}`;
    //     }
    //     return user?.email?.[0]?.toUpperCase() || 'U';
    // };

    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="mt-2 text-gray-500 text-lg">Manage your profile, security, and billing preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* User Mini Profile - Combined with Nav for cleaner look */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 flex flex-col items-center border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/50">
                                <div className="mb-4">
                                    <ProfilePictureUpload
                                        currentImage={user?.profilePicture}
                                        onUploadSuccess={(url) => {
                                            if (user) user.profilePicture = url;
                                            refreshSession();
                                        }}
                                        size="lg"
                                    />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 truncate max-w-full">
                                    @{profileData.username || 'user'}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium truncate max-w-full">{profileData.email}</p>
                            </div>

                            <nav className="p-3">
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { setActiveTab('profile'); setMessage(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'profile'
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <User size={18} className={activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'} />
                                        Profile Information
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('security'); setMessage(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'security'
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Lock size={18} className={activeTab === 'security' ? 'text-indigo-600' : 'text-gray-400'} />
                                        Security
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('billing'); setMessage(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'billing'
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <CreditCard size={18} className={activeTab === 'billing' ? 'text-indigo-600' : 'text-gray-400'} />
                                        Plan & Billing
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        {/* Toast Message */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={20} className="flex-shrink-0" /> : <XCircle size={20} className="flex-shrink-0" />}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                                <div className="p-8 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                                    <p className="text-gray-500 mt-1">Update your photo and personal details</p>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Username</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-400 font-bold">@</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.username}
                                                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400 hover:border-gray-300"
                                                    placeholder="username"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 pl-1">Email cannot be changed directly.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                value={profileData.firstName}
                                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400 hover:border-gray-300"
                                                placeholder="First Name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                value={profileData.lastName}
                                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400 hover:border-gray-300"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
                                        {hasChanges && (
                                            <button
                                                onClick={() => {
                                                    setProfileData(originalData);
                                                    setMessage(null);
                                                }}
                                                className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={!hasChanges || loading}
                                            className={`px-8 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 ${hasChanges && !loading
                                                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                                                : 'bg-gray-300 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            <Save size={18} />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                                <div className="p-8 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
                                    <p className="text-gray-500 mt-1">Manage your password and account security</p>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="max-w-2xl space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.current ? "text" : "password"}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.new ? "text" : "password"}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.confirm ? "text" : "password"}
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <p className="text-sm font-medium text-gray-900">Password requirements:</p>
                                            <ul className="text-sm text-gray-500 space-y-1 pl-1">
                                                <li className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    Minimum 8 characters
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    At least one uppercase letter
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    At least one number
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={loading}
                                                className="px-8 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Save size={18} />
                                                {loading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                                <div className="p-8 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">Subscription Plan</h3>
                                    <p className="text-gray-500 mt-1">Manage your billing and subscription details</p>
                                </div>
                                <div className="p-8 space-y-8">
                                    {/* Current Plan Banner */}
                                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                        <div className="relative z-10 flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-400 text-sm font-medium mb-1">Current Plan</p>
                                                <h2 className="text-3xl font-bold mb-2">Free Plan</h2>
                                                <p className="text-gray-400">Basic features for personal task management</p>
                                            </div>
                                            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">Active</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Pro Plan */}
                                        <div className="group relative rounded-2xl border-2 border-indigo-100 bg-white p-6 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                                                MOST POPULAR
                                            </div>
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">Pro Plan</h3>
                                                <div className="flex items-baseline gap-1 mt-2">
                                                    <span className="text-3xl font-bold text-gray-900">$12</span>
                                                    <span className="text-gray-500">/month</span>
                                                </div>
                                            </div>
                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-indigo-100 text-indigo-600"><CheckCircle size={14} /></div>
                                                    Unlimited Projects
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-indigo-100 text-indigo-600"><CheckCircle size={14} /></div>
                                                    Advanced Analytics
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-indigo-100 text-indigo-600"><CheckCircle size={14} /></div>
                                                    Calendar View
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => {
                                                    setSelectedPlan('Pro');
                                                    setShowPaymentModal(true);
                                                }}
                                                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                            >
                                                Upgrade to Pro
                                            </button>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="relative rounded-2xl border border-gray-200 bg-gray-50/50 p-6 hover:bg-white hover:border-gray-300 transition-all duration-300">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">Enterprise</h3>
                                                <div className="flex items-baseline gap-1 mt-2">
                                                    <span className="text-3xl font-bold text-gray-900">$49</span>
                                                    <span className="text-gray-500">/month</span>
                                                </div>
                                            </div>
                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-gray-200 text-gray-600"><CheckCircle size={14} /></div>
                                                    Everything in Pro
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-gray-200 text-gray-600"><CheckCircle size={14} /></div>
                                                    SSO & Advanced Security
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="p-1 rounded-full bg-gray-200 text-gray-600"><CheckCircle size={14} /></div>
                                                    Priority Support
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => {
                                                    setSelectedPlan('Enterprise');
                                                    setShowPaymentModal(true);
                                                }}
                                                className="w-full py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
                                            >
                                                Contact Sales
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">Checkout</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setPaymentLoading(true);
                            setTimeout(() => {
                                setPaymentLoading(false);
                                setShowPaymentModal(false);
                                setMessage({ type: 'success', text: `🎉 Welcome to ${selectedPlan} Plan!` });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 2000);
                        }} className="p-6 space-y-5">

                            <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Total Due Today</p>
                                    <p className="text-2xl font-bold text-indigo-900">${selectedPlan === 'Pro' ? '12.00' : '49.00'}</p>
                                </div>
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <CreditCard className="text-indigo-600" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Card Information</label>
                                <div className="mt-1.5 relative">
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm" required />
                                    <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-center text-sm" required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">CVC</label>
                                    <input type="text" placeholder="123" className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-center text-sm" required />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Name on Card</label>
                                <input type="text" placeholder="JOHN DOE" className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase text-sm" required />
                            </div>

                            <button type="submit" disabled={paymentLoading} className="w-full btn btn-primary py-3.5 mt-2 shadow-lg shadow-indigo-200">
                                {paymentLoading ? 'Processing...' : `Pay $${selectedPlan === 'Pro' ? '12.00' : '49.00'} Securely`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
