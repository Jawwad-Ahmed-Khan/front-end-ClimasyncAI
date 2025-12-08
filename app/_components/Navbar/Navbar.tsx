"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import NavLink from "./NavLink";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/map", label: "Map" },
    { href: "/task", label: "Task" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                {/* Animated Gradient Top Border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-60" />

                {/* Main Navbar Container */}
                <div
                    className={`relative transition-all duration-500 ${isScrolled
                        ? "bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-black/50"
                        : "bg-linear-to-b from-slate-950/95 to-slate-950/70 backdrop-blur-xl"
                        }`}
                    style={{
                        borderBottom: isScrolled
                            ? "1px solid rgba(6, 182, 212, 0.15)"
                            : "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                >
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative flex items-center px-6 md:px-10 lg:px-16 py-4">
                        {/* Left Section - Logo */}
                        <div className="shrink-0">
                            <Link href="/" className="flex items-center gap-4 group">
                                {/* Logo with Glow Effect */}
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative"
                                >
                                    {/* Glow Ring */}
                                    <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-40 blur-md transition-all duration-500" />
                                    <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-500/50 transition-all duration-300">
                                        <Image
                                            src="/images/logos/climasync-logo.png"
                                            alt="ClimasyncAI Logo"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </motion.div>

                                {/* Brand Name with Gradient */}
                                <div className="hidden sm:flex items-center">
                                    <span className="text-2xl font-bold bg-linear-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                                        Clima
                                    </span>
                                    <span className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                        sync
                                    </span>
                                    <span className="text-2xl font-bold text-white/90">
                                        AI
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Center Section - Navigation (Desktop) */}
                        <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/3 border border-white/5">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.href}
                                        href={link.href}
                                        label={link.label}
                                        isActive={pathname === link.href}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Section - Profile & Actions */}
                        <div className="flex items-center gap-4 ml-auto">
                            {/* Live Indicator */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                <span className="text-xs font-semibold text-emerald-400 tracking-wide">LIVE</span>
                            </div>

                            {/* Profile Dropdown (Desktop) */}
                            <div className="hidden lg:block">
                                <ProfileDropdown />
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
                                aria-label="Toggle mobile menu"
                            >
                                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5 text-white relative z-10" />
                                ) : (
                                    <Menu className="w-5 h-5 text-white relative z-10" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu
                        navLinks={navLinks}
                        pathname={pathname}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
