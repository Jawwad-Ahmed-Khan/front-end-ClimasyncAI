"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Tag,
    Plus,
    X,
    Waves,
    Stethoscope,
    Users,
    UtensilsCrossed,
    Home,
    Ship,
    Building,
} from "lucide-react";
import { generateMockSpecializations, generateMockOperationalAreas } from "../_lib/mockData";
import { addSpecialization, removeSpecialization, addOperationalArea, removeOperationalArea } from "../_lib/actions";
import { Specialization, OperationalArea } from "../_lib/types";

// ============================================
// AREAS PAGE
// ============================================
// Manage specializations and operational areas
// Used as: /dashboard/areas

const availableSpecializations = [
    { name: "Flood Response", icon: <Waves size={16} /> },
    { name: "Medical Aid", icon: <Stethoscope size={16} /> },
    { name: "Evacuation", icon: <Users size={16} /> },
    { name: "Food Distribution", icon: <UtensilsCrossed size={16} /> },
    { name: "Shelter Management", icon: <Home size={16} /> },
    { name: "Water Rescue", icon: <Ship size={16} /> },
    { name: "Search & Rescue", icon: <Users size={16} /> },
    { name: "Earthquake Response", icon: <Building size={16} /> },
];

const provinces = ["Sindh", "Punjab", "KPK", "Balochistan", "AJK", "Gilgit-Baltistan"];

const districtsByProvince: Record<string, string[]> = {
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpurkhas", "Jacobabad"],
    Punjab: ["Lahore", "Multan", "Faisalabad", "Rawalpindi", "Gujranwala", "Sialkot"],
    KPK: ["Peshawar", "Swat", "Abbottabad", "Mardan", "Kohat", "Chitral"],
    Balochistan: ["Quetta", "Gwadar", "Khuzdar", "Turbat", "Zhob"],
    AJK: ["Muzaffarabad", "Mirpur", "Kotli", "Rawalakot"],
    "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza", "Ghizer"],
};

export default function AreasPage() {
    const [specializations, setSpecializations] = useState<Specialization[]>(
        generateMockSpecializations()
    );
    const [operationalAreas, setOperationalAreas] = useState<OperationalArea[]>(
        generateMockOperationalAreas()
    );

    // Form states
    const [showAddArea, setShowAddArea] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    // Check if specialization already exists
    const hasSpecialization = (name: string) =>
        specializations.some((s) => s.name === name);

    // Check if area already exists
    const hasArea = (district: string, province: string) =>
        operationalAreas.some((a) => a.district === district && a.province === province);

    // Add specialization
    const handleAddSpecialization = async (name: string) => {
        if (hasSpecialization(name)) return;
        const result = await addSpecialization(name);
        if (result.success) {
            setSpecializations((prev) => [...prev, { id: result.id, name, icon: "" }]);
        }
    };

    // Remove specialization
    const handleRemoveSpecialization = async (id: string) => {
        const result = await removeSpecialization(id);
        if (result.success) {
            setSpecializations((prev) => prev.filter((s) => s.id !== id));
        }
    };

    // Add operational area
    const handleAddArea = async () => {
        if (!selectedDistrict || !selectedProvince) return;
        if (hasArea(selectedDistrict, selectedProvince)) return;

        const result = await addOperationalArea(selectedDistrict, selectedProvince);
        if (result.success) {
            setOperationalAreas((prev) => [
                ...prev,
                { id: result.id, district: selectedDistrict, province: selectedProvince },
            ]);
            setSelectedProvince("");
            setSelectedDistrict("");
            setShowAddArea(false);
        }
    };

    // Remove operational area
    const handleRemoveArea = async (id: string) => {
        const result = await removeOperationalArea(id);
        if (result.success) {
            setOperationalAreas((prev) => prev.filter((a) => a.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Specializations & Areas
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Define your expertise and operational coverage
                </p>
            </motion.div>

            {/* Specializations Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                        <Tag size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Specializations
                    </h2>
                </div>

                {/* Current Specializations */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                        Your Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {specializations.map((spec) => (
                            <motion.div
                                key={spec.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
                            >
                                <span className="text-sm font-medium">{spec.name}</span>
                                <button
                                    onClick={() => handleRemoveSpecialization(spec.id)}
                                    className="p-0.5 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Available Specializations */}
                <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                        Add Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSpecializations
                            .filter((s) => !hasSpecialization(s.name))
                            .map((spec) => (
                                <motion.button
                                    key={spec.name}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAddSpecialization(spec.name)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {spec.icon}
                                    <span className="text-sm font-medium">{spec.name}</span>
                                    <Plus size={14} />
                                </motion.button>
                            ))}
                    </div>
                </div>
            </motion.div>

            {/* Operational Areas Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Operational Areas
                        </h2>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddArea(!showAddArea)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
                    >
                        <Plus size={18} />
                        Add Area
                    </motion.button>
                </div>

                {/* Add Area Form */}
                {showAddArea && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Province Select */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Province
                                </label>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setSelectedDistrict("");
                                    }}
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((province) => (
                                        <option key={province} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* District Select */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    District
                                </label>
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!selectedProvince}
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                >
                                    <option value="">Select District</option>
                                    {selectedProvince &&
                                        districtsByProvince[selectedProvince]?.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Add Button */}
                            <div className="flex items-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddArea}
                                    disabled={!selectedDistrict || !selectedProvince}
                                    className="px-6 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Areas List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {operationalAreas.map((area) => (
                        <motion.div
                            key={area.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-purple-500 dark:text-purple-400" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {area.district}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {area.province}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveArea(area.id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {operationalAreas.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        No operational areas defined. Add areas where your organization can respond.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
