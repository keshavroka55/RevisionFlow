import { useEffect, useMemo, useState } from 'react';
import { User, Bell, CreditCard, GraduationCap, LogOut, Loader, AlertCircle, Save } from 'lucide-react';
import { useAuthLoading, useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { useUserLoading, useUserStore } from '../store/user.store';
import { useRevisionLoading, useRevisionStore } from '../store/revision.store';

const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
];

const toTimeValue = (hour: number, minute: number) =>
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

const parseTimeValue = (value: string) => {
    const [hourText, minuteText] = value.split(':');
    return {
        hour: Number(hourText),
        minute: Number(minuteText),
    };
};



export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileForm, setProfileForm] = useState({ name: '', timezone: '' });
    const [notificationForm, setNotificationForm] = useState({
        emailRevisionReminders: true,
        emailStreakAlerts: true,
        reminderTime: '09:00',
        reminderTimezone: 'UTC',
        pushNotifications: false,
    });
    const [profileSuccess, setProfileSuccess] = useState('');
    const [notificationSuccess, setNotificationSuccess] = useState('');
    const [localMessage, setLocalMessage] = useState('');
    const { logout } = useAuthStore();
    const isLoading = useAuthLoading("auth.logout")
    const { profile, error, fetchProfile, updateProfile, updateNotificationPreferences, clearError } = useUserStore();
    const { updateRevisionTime, error: revisionError } = useRevisionStore();
    const isFetchingProfile = useUserLoading('user.fetchProfile');
    const isSavingProfile = useUserLoading('user.updateProfile');
    const isSavingNotifications = useUserLoading('user.updateNotificationPreferences');
    const isSavingRevisionTime = useRevisionLoading('revision.updateTime');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!profile) return;

        setProfileForm({
            name: profile.name,
            timezone: profile.timezone || 'UTC',
        });

        setNotificationForm({
            emailRevisionReminders: profile.notificationPrefs?.emailRevisionReminders ?? true,
            emailStreakAlerts: profile.notificationPrefs?.emailStreakAlerts ?? true,
            reminderTime: toTimeValue(
                profile.notificationPrefs?.reminderTimeHour ?? 9,
                profile.notificationPrefs?.reminderTimeMinute ?? 0,
            ),
            reminderTimezone: profile.notificationPrefs?.reminderTimezone ?? profile.timezone ?? 'UTC',
            pushNotifications: false,
        });
    }, [profile]);

    const currentPlan = useMemo(() => {
        if (!profile?.subscription) {
            return {
                name: 'Free Plan',
                price: '$0/mo',
                description: 'Basic features for learning',
            };
        }

        const planName = profile.subscription.plan === 'STUDENT_PREMIUM'
            ? 'Student Premium'
            : profile.subscription.plan === 'PREMIUM'
                ? 'Premium'
                : 'Free Plan';

        return {
            name: planName,
            price: profile.subscription.plan === 'FREE' ? '$0/mo' : 'Active',
            description: `Status: ${profile.subscription.status}`,
        };
    }, [profile]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleProfileSave = async () => {
        setProfileSuccess('');
        setNotificationSuccess('');
        setLocalMessage('');
        clearError();
        try {
            await updateProfile({
                name: profileForm.name.trim(),
                timezone: profileForm.timezone,
            });
            setProfileSuccess('Profile settings saved.');
        } catch {
        }
    };

    const handleProfileCancel = () => {
        if (!profile) return;
        setProfileForm({
            name: profile.name,
            timezone: profile.timezone || 'UTC',
        });
        setProfileSuccess('');
        clearError();
    };

    const handleNotificationSave = async () => {
        setProfileSuccess('');
        setNotificationSuccess('');
        setLocalMessage('');
        clearError();

        const { hour, minute } = parseTimeValue(notificationForm.reminderTime);
        if (![0, 30].includes(minute)) {
            setLocalMessage('Reminder time supports only :00 or :30 because that is what the backend accepts.');
            return;
        }

        try {
            await updateNotificationPreferences({
                emailRevisionReminders: notificationForm.emailRevisionReminders,
                emailStreakAlerts: notificationForm.emailStreakAlerts,
                reminderTimeHour: hour,
                reminderTimeMinute: minute,
                reminderTimezone: notificationForm.reminderTimezone,
            });
            await updateRevisionTime({ hour, minute });
            if (profile && profile.timezone !== notificationForm.reminderTimezone) {
                await updateProfile({ timezone: notificationForm.reminderTimezone });
            }
            await fetchProfile();
            setNotificationSuccess('Notification settings saved.');
        } catch {
        }
    };

    const handleNotificationReset = () => {
        if (!profile) return;
        setNotificationForm({
            emailRevisionReminders: profile.notificationPrefs?.emailRevisionReminders ?? true,
            emailStreakAlerts: profile.notificationPrefs?.emailStreakAlerts ?? true,
            reminderTime: toTimeValue(
                profile.notificationPrefs?.reminderTimeHour ?? 9,
                profile.notificationPrefs?.reminderTimeMinute ?? 0,
            ),
            reminderTimezone: profile.notificationPrefs?.reminderTimezone ?? profile.timezone ?? 'UTC',
            pushNotifications: false,
        });
        setNotificationSuccess('');
        setLocalMessage('');
        clearError();
    };

    if (isFetchingProfile && !profile) {
        return (
            <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
                <div className="max-w-4xl mx-auto min-h-[40vh] flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }



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
                                {error && (
                                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {profileSuccess && (
                                    <div className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
                                        {profileSuccess}
                                    </div>
                                )}
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
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
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
                                                value={profile?.email ?? ''}
                                                readOnly
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="timezone" className="block text-sm mb-2 text-foreground">
                                                Timezone
                                            </label>
                                            <select
                                                id="timezone"
                                                value={profileForm.timezone}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, timezone: e.target.value }))}
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                {timezones.map((timezone) => (
                                                    <option key={timezone} value={timezone}>{timezone}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
                                    <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground mb-4">
                                        Backend password update is not exposed on this page yet. Use the reset-password flow if you need to change it now.
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm mb-2 text-foreground">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                disabled
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
                                                disabled
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
                                                disabled
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleProfileSave}
                                        disabled={isSavingProfile}
                                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                                    >
                                        {isSavingProfile && <Loader className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleProfileCancel}
                                        className="bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                {(error || revisionError || localMessage) && (
                                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5" />
                                        <span>{localMessage || revisionError || error}</span>
                                    </div>
                                )}
                                {notificationSuccess && (
                                    <div className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
                                        {notificationSuccess}
                                    </div>
                                )}
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
                                                    checked={notificationForm.emailRevisionReminders}
                                                    onChange={(e) => setNotificationForm((prev) => ({
                                                        ...prev,
                                                        emailRevisionReminders: e.target.checked,
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Weekly Summary</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Backend persistence is not built for this setting yet
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input type="checkbox" disabled className="sr-only peer" />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Achievement Notifications</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Stored on the backend as streak alerts
                                                </p>
                                            </div>
                                            <label className="relative inline-block w-12 h-6">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationForm.emailStreakAlerts}
                                                    onChange={(e) => setNotificationForm((prev) => ({
                                                        ...prev,
                                                        emailStreakAlerts: e.target.checked,
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background rounded-lg">
                                            <div>
                                                <label htmlFor="reminderTime" className="block text-sm mb-2 text-foreground">
                                                    Daily Reminder Time
                                                </label>
                                                <input
                                                    type="time"
                                                    id="reminderTime"
                                                    step={1800}
                                                    value={notificationForm.reminderTime}
                                                    onChange={(e) => setNotificationForm((prev) => ({
                                                        ...prev,
                                                        reminderTime: e.target.value,
                                                    }))}
                                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                                <p className="text-xs text-muted-foreground mt-2">Only half-hour slots are supported by the backend.</p>
                                            </div>
                                            <div>
                                                <label htmlFor="reminderTimezone" className="block text-sm mb-2 text-foreground">
                                                    Reminder Timezone
                                                </label>
                                                <select
                                                    id="reminderTimezone"
                                                    value={notificationForm.reminderTimezone}
                                                    onChange={(e) => setNotificationForm((prev) => ({
                                                        ...prev,
                                                        reminderTimezone: e.target.value,
                                                    }))}
                                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    {timezones.map((timezone) => (
                                                        <option key={timezone} value={timezone}>{timezone}</option>
                                                    ))}
                                                </select>
                                            </div>
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
                                                    checked={notificationForm.pushNotifications}
                                                    onChange={(e) => setNotificationForm((prev) => ({
                                                        ...prev,
                                                        pushNotifications: e.target.checked,
                                                    }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Browser push preference is local UI only right now. No backend endpoint exists yet.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleNotificationSave}
                                        disabled={isSavingNotifications || isSavingRevisionTime}
                                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                                    >
                                        {(isSavingNotifications || isSavingRevisionTime) ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Notification Settings
                                    </button>
                                    <button
                                        onClick={handleNotificationReset}
                                        className="bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        Reset
                                    </button>
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

                                    <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground mb-6">
                                        Student verification backend flow is not implemented yet, so this tab is informational only right now.
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
                                                disabled
                                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        <div className="text-center py-4 text-muted-foreground">OR</div>

                                        <div>
                                            <label className="block text-sm mb-2 text-foreground">Upload Student ID</label>
                                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center opacity-60 cursor-not-allowed">
                                                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                                <p className="text-sm text-foreground mb-1">Click to upload student ID</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button disabled className="w-full bg-accent text-white px-6 py-3 rounded-lg opacity-60 cursor-not-allowed transition-colors">
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
                                                <h3 className="text-lg font-semibold text-foreground">{currentPlan.name}</h3>
                                                <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                                            </div>
                                            <div className="text-2xl font-bold text-foreground">{currentPlan.price}</div>
                                        </div>
                                        <button disabled className="w-full bg-primary text-white px-6 py-3 rounded-lg opacity-60 cursor-not-allowed transition-colors">
                                            Upgrade to Premium
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Billing portal integration is not connected to the backend yet.
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
                            <button disabled className="bg-destructive text-white px-4 py-2 rounded-lg opacity-60 cursor-not-allowed transition-colors">
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
