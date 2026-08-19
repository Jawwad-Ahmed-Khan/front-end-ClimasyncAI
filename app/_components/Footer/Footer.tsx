"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
    platform: {
        title: "Platform",
        links: [
            { label: "Map Dashboard", href: "/map" },
            { label: "Task Management", href: "/task" },
            { label: "News & Alerts", href: "/news" },
            { label: "AI Verification", href: "/verify" },
        ],
    },
    resources: {
        title: "Resources",
        links: [
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/api" },
            { label: "Case Studies", href: "/cases" },
            { label: "Research", href: "/research" },
        ],
    },
    organization: {
        title: "Organization",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Our Team", href: "/team" },
            { label: "Partners", href: "/partners" },
            { label: "Careers", href: "/careers" },
        ],
    },
    support: {
        title: "Support",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Contact Us", href: "/contact" },
            { label: "Report Issue", href: "/report" },
            { label: "FAQs", href: "/faqs" },
            { label: "Login", href: "/login" },
            { label: "Create Account", href: "/register" },
        ],
    },
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
    return (
        <footer className="relative bg-slate-950 overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3 group w-fit">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-500/30 transition-all"
                                >
                                    <Image
                                        src="/images/logos/climasync-logo.png"
                                        alt="ClimasyncAI"
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </motion.div>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold text-white">Clima</span>
                                    <span className="text-2xl font-bold text-cyan-400">sync</span>
                                    <span className="text-2xl font-bold text-white">AI</span>
                                </div>
                            </Link>

                            {/* Tagline */}
                            <p className="text-slate-400 leading-relaxed max-w-sm">
                                AI-powered disaster management platform providing real-time verification,
                                risk analysis, and coordinated response for Pakistan and beyond.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin className="w-4 h-4 text-cyan-500" />
                                    <span className="text-sm">Islamabad, Pakistan</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Mail className="w-4 h-4 text-cyan-500" />
                                    <span className="text-sm">contact@climasyncai.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Phone className="w-4 h-4 text-cyan-500" />
                                    <span className="text-sm">+92 51 1234567</span>
                                </div>
                            </div>
                        </div>

                        {/* Links Columns */}
                        {Object.values(footerLinks).map((section) => (
                            <div key={section.title} className="space-y-4">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-400 hover:text-cyan-400 text-sm transition-colors duration-200 inline-block"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 flex items-center justify-center transition-all duration-300 group"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                    </motion.a>
                                ))}
                            </div>

                            {/* Copyright */}
                            <p className="text-slate-500 text-sm text-center">
                                © {new Date().getFullYear()} ClimasyncAI. All rights reserved.
                            </p>

                            {/* Legal Links */}
                            <div className="flex items-center gap-6">
                                <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
