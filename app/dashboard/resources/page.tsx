"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Package,
    Truck,
    Users,
    Clock,
    Save,
} from "lucide-react";
import { ResourceCard } from "../_components";
import { NGOResources } from "../_lib/types";
import { getMyResources, updateResourceCapacity } from "@/app/_lib/resources/resourceService";

// ============================================
// RESOURCES PAGE
// ============================================
// Manage NGO resource inventory (vehicles, personnel, capacity)
// Used as: /dashboard/resources

type ResourceKey = keyof Omit<NGOResources, "lastUpdated">;

interface ResourceGroup {
    title: string;
    icon: React.ReactNode;
    category: "vehicles" | "personnel" | "capacity";
    items: { key: ResourceKey; label: string }[];
}

const resourceGroups: ResourceGroup[] = [
    {
        title: "Vehicles",
        icon: <Truck size={20} />,
        category: "vehicles",
        items: [
            { key: "ambulances", label: "Ambulances" },
            { key: "rescueBoats", label: "Rescue Boats" },
            { key: "trucks", label: "Trucks" },
            { key: "fourWheelVehicles", label: "4x4 Vehicles" },
            { key: "cranes", label: "Cranes" },
        ],
    },
    {
        title: "Personnel",
        icon: <Users size={20} />,
        category: "personnel",
        items: [
            { key: "doctors", label: "Doctors" },
            { key: "paramedics", label: "Paramedics" },
            { key: "rescueDivers", label: "Rescue Divers" },
            { key: "volunteersAvailable", label: "Volunteers" },
        ],
    },
    {
        title: "Capacity",
        icon: <Package size={20} />,
        category: "capacity",
        items: [
            { key: "foodPacketsCapacity", label: "Food Packets" },
            { key: "shelterCapacity", label: "Shelter Capacity" },
        ],
    },
];

export default function ResourcesPage() {
    const [resources, setResources] = useState<NGOResources | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchResources = async () => {
            try {
                const profile = await getMyResources();
                if (isMounted && profile.capabilities) {
                    const cap = profile.capabilities;
                    setResources({
                        ambulances: cap.ambulances || 0,
                        rescueBoats: cap.rescue_boats || 0,
                        trucks: cap.trucks || 0,
                        fourWheelVehicles: cap.four_wheel_vehicles || 0,
                        cranes: cap.cranes || 0,
                        doctors: cap.doctors || 0,
                        paramedics: cap.paramedics || 0,
                        rescueDivers: cap.rescue_divers || 0,
                        volunteersAvailable: cap.volunteers_available || 0,
                        foodPacketsCapacity: cap.food_packets_capacity || 0,
                        shelterCapacity: cap.shelter_capacity || 0,
                        lastUpdated: new Date()
                    });
                } else if (isMounted) {
                    setResources({
                        ambulances: 0, rescueBoats: 0, trucks: 0, fourWheelVehicles: 0, cranes: 0,
                        doctors: 0, paramedics: 0, rescueDivers: 0, volunteersAvailable: 0,
                        foodPacketsCapacity: 0, shelterCapacity: 0, lastUpdated: new Date()
                    });
                }
            } catch (e) {
                console.error("Failed to load resources:", e);
                if (isMounted) {
                    setResources({
                        ambulances: 0, rescueBoats: 0, trucks: 0, fourWheelVehicles: 0, cranes: 0,
                        doctors: 0, paramedics: 0, rescueDivers: 0, volunteersAvailable: 0,
                        foodPacketsCapacity: 0, shelterCapacity: 0, lastUpdated: new Date()
                    });
                }
            }
        };
        fetchResources();
        return () => { isMounted = false; };
    }, []);

    if (!resources) {
        return <div className="p-8 text-center text-slate-500">Loading resources...</div>;
    }


    const handleUpdateResource = (key: ResourceKey, value: number) => {
        setResources((prev) => prev ? { ...prev, [key]: value } : null);
        setHasChanges(true);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            // Map the frontend NGOResources object back to the payload
            const payload = {
                ambulances: resources.ambulances,
                rescue_boats: resources.rescueBoats,
                trucks: resources.trucks,
                four_wheel_vehicles: resources.fourWheelVehicles,
                cranes: resources.cranes,
                doctors: resources.doctors,
                paramedics: resources.paramedics,
                rescue_divers: resources.rescueDivers,
                volunteers_available: resources.volunteersAvailable,
                food_packets_capacity: resources.foodPacketsCapacity,
                shelter_capacity: resources.shelterCapacity,
            };
            await updateResourceCapacity(payload);
            setResources((prev) => prev ? { ...prev, lastUpdated: new Date() } : null);
            setHasChanges(false);
        } catch (e) {
            console.error("Failed to update resources:", e);
        }
        setIsSaving(false);
    };

    const formatLastUpdated = (date: Date) => {
        return date.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Resources
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your organization's available resources
                    </p>
                </div>

                {/* Save Button & Last Updated */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock size={16} />
                        <span>Updated: {formatLastUpdated(resources.lastUpdated)}</span>
                    </div>
                    {hasChanges && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save size={18} />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Resource Groups */}
            <div className="space-y-8">
                {resourceGroups.map((group, groupIndex) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                    >
                        {/* Group Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${group.category === "vehicles"
                                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                    : group.category === "personnel"
                                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                        : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                }`}>
                                {group.icon}
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {group.title}
                            </h2>
                        </div>

                        {/* Resource Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {group.items.map((item) => (
                                <ResourceCard
                                    key={item.key}
                                    icon={item.key as any}
                                    label={item.label}
                                    value={resources[item.key] as number}
                                    category={group.category}
                                    onUpdate={(value) => handleUpdateResource(item.key, value)}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30"
            >
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> Keep your resources updated to help administrators assign appropriate tasks.
                    Click the edit icon on any resource to update its availability.
                </p>
            </motion.div>
        </div>
    );
}
