"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Building,
    Mail,
    Phone,
    MapPin,
    Lock,
    Bell,
    Save,
    Edit3,
    BadgeCheck,
} from "lucide-react";
import { generateMockNGOProfile } from "../_lib/mockData";
import { updateProfile, changePassword } from "../_lib/actions";
import { NGOProfile } from "../_lib/types";

// ============================================
// PROFILE PAGE
// ============================================
// Organization profile and account settings
// Used as: /dashboard/profile

export default function ProfilePage() {
    const [profile, setProfile] = useState<NGOProfile>(generateMockNGOProfile());
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        orgName: profile.orgName,
        headOfOperations: profile.headOfOperations,
        email: profile.email,
        phone: profile.phone,
        baseCity: profile.baseCity,
        baseDistrict: profile.baseDistrict,
        baseProvince: profile.baseProvince,
        serviceRadiusKm: profile.serviceRadiusKm,
    });

    // Password change states
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        taskAssignments: true,
        disasterAlerts: true,
        systemUpdates: false,
    });

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const result = await updateProfile(formData);
        if (result.success) {
            setProfile((prev) => ({ ...prev, ...formData }));
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        const result = await changePassword(
            passwordData.currentPassword,
            passwordData.newPassword
        );

        if (result.success) {
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordError("");
        } else {
            setPasswordError(result.message);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Profile & Settings
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your organization profile and account settings
                    </p>
                </div>

                {!isEditing ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </motion.button>
                ) : (
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    orgName: profile.orgName,
                                    headOfOperations: profile.headOfOperations,
                                    email: profile.email,
                                    phone: profile.phone,
                                    baseCity: profile.baseCity,
                                    baseDistrict: profile.baseDistrict,
                                    baseProvince: profile.baseProvince,
                                    serviceRadiusKm: profile.serviceRadiusKm,
                                });
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                        >
                            <Save size={18} />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </motion.button>
                    </div>
                )}
            </motion.div>

            {/* Organization Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Building size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Organization Information
                    </h2>
                    {profile.isVerified && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                            <BadgeCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Verified
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organization Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Organization Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.orgName}
                                onChange={(e) => handleInputChange("orgName", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.orgName}
                            </p>
                        )}
                    </div>

                    {/* Registration Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Registration Number
                        </label>
                        <p className="text-slate-900 dark:text-white font-medium">
                            {profile.registrationNumber}
                        </p>
                    </div>

                    {/* Head of Operations */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Head of Operations
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.headOfOperations}
                                onChange={(e) => handleInputChange("headOfOperations", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.headOfOperations}
                            </p>
                        )}
                    </div>

                    {/* Service Radius */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Service Radius (km)
                        </label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.serviceRadiusKm}
                                onChange={(e) => handleInputChange("serviceRadiusKm", parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.serviceRadiusKm} km
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Contact Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <Mail size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Contact Details
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Email Address
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.email}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.phone}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Base Location */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        <MapPin size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Base Location
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            City
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.baseCity}
                                onChange={(e) => handleInputChange("baseCity", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.baseCity}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            District
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.baseDistrict}
                                onChange={(e) => handleInputChange("baseDistrict", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.baseDistrict}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Province
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.baseProvince}
                                onChange={(e) => handleInputChange("baseProvince", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium">
                                {profile.baseProvince}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Account Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Account Settings
                    </h2>
                </div>

                {/* Change Password */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                        Password
                    </h3>
                    {!showPasswordForm ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Change Password
                        </motion.button>
                    ) : (
                        <div className="space-y-4 max-w-md">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                        setPasswordError("");
                                    }}
                                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleChangePassword}
                                    className="px-4 py-2 rounded-xl bg-cyan-500 text-white"
                                >
                                    Update Password
                                </motion.button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notification Preferences */}
                <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                        Notification Preferences
                    </h3>
                    <div className="space-y-3">
                        {[
                            { key: "emailAlerts", label: "Email Alerts" },
                            { key: "smsAlerts", label: "SMS Alerts" },
                            { key: "taskAssignments", label: "Task Assignments" },
                            { key: "disasterAlerts", label: "Disaster Alerts" },
                            { key: "systemUpdates", label: "System Updates" },
                        ].map((item) => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) =>
                                        setNotifications((prev) => ({
                                            ...prev,
                                            [item.key]: e.target.checked,
                                        }))
                                    }
                                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                                />
                                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
