import React, { useState } from 'react';
import { updateSettings } from '../services/api';
import { AlertInfo } from '../types';
import Alert from '../components/Alert';

const Settings: React.FC = () => {
    // General Settings
    const [pharmacyName, setPharmacyName] = useState('PharmaIQ Central');
    const [stockThreshold, setStockThreshold] = useState(10);
    
    // Automated Sync
    const [autoSync, setAutoSync] = useState(true);
    const [syncTime, setSyncTime] = useState('02:00');
    
    // Notification Settings
    const [notifications, setNotifications] = useState({
        lowStock: { email: true, whatsapp: true },
        expiringSoon: { email: true, whatsapp: false },
        outOfStock: { email: true, whatsapp: true },
        weeklyReport: { email: true, whatsapp: false },
    });

    // Contact Info
    const [email, setEmail] = useState('admin@pharmiq.com');
    const [mobile, setMobile] = useState('+91 98765 43210');
    const [isEmailVerified] = useState(true);
    const [isMobileVerified] = useState(true);

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState<AlertInfo | null>(null);
    
    const handleNotificationChange = (type: keyof typeof notifications, channel: 'email' | 'whatsapp') => {
        setNotifications(prev => ({
            ...prev,
            [type]: { ...prev[type], [channel]: !prev[type][channel] }
        }));
    };

    const handleSave = async (section: string) => {
        setSaving(true);
        setAlert(null);
        try {
            let settingsData = {};
            if (section === 'general') {
                settingsData = { pharmacyName, stockThreshold };
            } else if (section === 'password') {
                if (newPassword !== confirmPassword) {
                    setAlert({ type: 'error', title: 'Password Mismatch', message: "The new passwords you entered do not match. Please try again." });
                    setSaving(false);
                    return;
                }
                settingsData = { currentPassword, newPassword };
            } else if (section === 'sync') {
                 settingsData = { autoSync, syncTime };
            } else if (section === 'notifications') {
                settingsData = { notifications };
            }
            
            await updateSettings(settingsData);
            setAlert({ type: 'success', title: 'Settings Saved', message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully!` });
        } catch (error) {
            setAlert({ type: 'error', title: 'Save Failed', message: 'Failed to save settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-neutral-800">Settings</h1>

            {alert && <div className="sticky top-20 z-20"><Alert {...alert} onClose={() => setAlert(null)} /></div>}

            {/* General Settings */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                <h2 className="text-xl font-semibold text-neutral-700 mb-4">General Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="pharmacy-name" className="block text-sm font-medium text-neutral-700">Pharmacy Name</label>
                        <input type="text" id="pharmacy-name" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label htmlFor="stock-threshold" className="block text-sm font-medium text-neutral-700">Stock Alert Threshold</label>
                        <input type="number" id="stock-threshold" value={stockThreshold} onChange={(e) => setStockThreshold(Number(e.target.value))} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div className="text-right pt-2">
                        <button onClick={() => handleSave('general')} disabled={saving} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300">
                            {saving ? 'Saving...' : 'Save General Settings'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Automated Sync */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                <h2 className="text-xl font-semibold text-neutral-700 mb-4">Automated Sync</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-neutral-700">Enable Daily Auto-Sync</p>
                            <p className="text-sm text-neutral-500">Automatically sync data from your ERP/POS once every 24 hours.</p>
                        </div>
                        <label htmlFor="auto-sync-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="auto-sync-toggle" className="sr-only" checked={autoSync} onChange={() => setAutoSync(!autoSync)} />
                                <div className={`block w-14 h-8 rounded-full transition ${autoSync ? 'bg-primary-600' : 'bg-neutral-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${autoSync ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    {autoSync && (
                        <div>
                            <label htmlFor="sync-time" className="block text-sm font-medium text-neutral-700">Sync Time</label>
                            <input type="time" id="sync-time" value={syncTime} onChange={(e) => setSyncTime(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    )}
                     <p className="text-sm text-neutral-500">Last synced: 3 hours ago</p>
                    <div className="text-right pt-2">
                        <button onClick={() => handleSave('sync')} disabled={saving} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300">
                            {saving ? 'Saving...' : 'Save Sync Settings'}
                        </button>
                    </div>
                </div>
            </div>
            
             {/* Notifications & Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                <h2 className="text-xl font-semibold text-neutral-700 mb-4">Notifications & Alerts</h2>
                <div className="space-y-4">
                     <p className="text-sm text-neutral-600">
                        Alerts will be sent to <span className="font-medium text-neutral-800">{email}</span> {isEmailVerified && <span className="text-xs text-success-600">(Verified)</span>} and <span className="font-medium text-neutral-800">{mobile}</span> {isMobileVerified && <span className="text-xs text-success-600">(Verified)</span>}.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-neutral-600">
                                    <th className="py-2 pr-4">Alert Type</th>
                                    <th className="py-2 px-4 text-center">Email</th>
                                    <th className="py-2 pl-4 text-center">WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {Object.keys(notifications).map((key) => (
                                    <tr key={key}>
                                        <td className="py-3 pr-4 font-medium text-neutral-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                                        <td className="py-3 px-4 text-center">
                                            <input type="checkbox" className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500" checked={notifications[key as keyof typeof notifications].email} onChange={() => handleNotificationChange(key as keyof typeof notifications, 'email')} />
                                        </td>
                                        <td className="py-3 pl-4 text-center">
                                            <input type="checkbox" className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500" checked={notifications[key as keyof typeof notifications].whatsapp} onChange={() => handleNotificationChange(key as keyof typeof notifications, 'whatsapp')} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right pt-2">
                        <button onClick={() => handleSave('notifications')} disabled={saving} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300">
                            {saving ? 'Saving...' : 'Save Notification Settings'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
                <h2 className="text-xl font-semibold text-neutral-700 mb-4">Change Password</h2>
                <div className="space-y-4">
                     <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                     <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                     <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                    <div className="text-right pt-2">
                        <button onClick={() => handleSave('password')} disabled={saving} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300">
                           {saving ? 'Saving...' : 'Update Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;