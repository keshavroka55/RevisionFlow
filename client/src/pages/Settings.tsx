import { useState } from 'react';
import { User, Bell, CreditCard, GraduationCap, LogOut } from 'lucide-react';
import { useAuthLoading, useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';



export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const { logout } = useAuthStore();
    const isLoading = useAuthLoading("auth.logout")
    const navigate = useNavigate();


    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };



    return (
        <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
                    <div className="flex overflow-x-auto border-b border-border">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'notifications'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Bell className="w-4 h-4" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('student')}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'student'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Student Verification
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'billing'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <CreditCard className="w-4 h-4" />
                            Billing
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm mb-2 text-foreground">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                defaultValue="John Doe"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                defaultValue="john@example.com"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="timezone" className="block text-sm mb-2 text-foreground">
                                                Timezone
                                            </label>
                                            <select
                                                id="timezone"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option>UTC-5 (Eastern Time)</option>
                                                <option>UTC-8 (Pacific Time)</option>
                                                <option>UTC+0 (GMT)</option>
                                                <option>UTC+1 (CET)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm mb-2 text-foreground">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm mb-2 text-foreground">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm mb-2 text-foreground">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                        Save Changes
                                    </button>
                                    <button className="bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Email Notifications</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Revision Reminders</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Get email reminders when revisions are due
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input
                                                    type="checkbox"
                                                    checked={emailNotifications}
                                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Weekly Summary</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive a weekly summary of your progress
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Achievement Notifications</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified about milestones and achievements
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Push Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Browser Notifications</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications in your browser
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input
                                                    type="checkbox"
                                                    checked={pushNotifications}
                                                    onChange={(e) => setPushNotifications(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Student Verification Tab */}
                        {activeTab === 'student' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Student Verification</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Verify your student status to get Premium features free for 3-6 months!
                                    </p>

                                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-6">
                                        <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li>✓ Free Premium access for 3-6 months</li>
                                            <li>✓ All Premium features unlocked</li>
                                            <li>✓ Priority student support</li>
                                            <li>✓ Educational resources</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="studentEmail" className="block text-sm mb-2 text-foreground">
                                                Student Email (.edu)
                                            </label>
                                            <input
                                                type="email"
                                                id="studentEmail"
                                                placeholder="you@university.edu"
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        <div className="text-center py-4 text-muted-foreground">OR</div>

                                        <div>
                                            <label className="block text-sm mb-2 text-foreground">Upload Student ID</label>
                                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                                <p className="text-sm text-foreground mb-1">Click to upload student ID</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors">
                                    Submit for Verification
                                </button>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Current Plan</h2>
                                    <div className="bg-background rounded-lg p-6 border border-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">Free Plan</h3>
                                                <p className="text-sm text-muted-foreground">Basic features for learning</p>
                                            </div>
                                            <div className="text-2xl font-bold text-foreground">$0/mo</div>
                                        </div>
                                        <button className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                            Upgrade to Premium
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        No payment method on file. Upgrade to Premium to add a payment method.
                                    </p>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                                    <div className="text-center py-8">
                                        <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">No billing history yet</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border-2 border-destructive/20 p-6">
                    <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-foreground">Delete Account</h4>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <button className="bg-destructive text-white px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors">
                                Delete Account
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-foreground">Log Out</h4>
                                <p className="text-sm text-muted-foreground">Sign out of your account</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoading ? "Logging out..." : "Log Out"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
