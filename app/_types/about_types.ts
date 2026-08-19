// ============================================
// ABOUT PAGE - TYPE DEFINITIONS
// ============================================

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
}

export interface Stat {
    id: number;
    number: string;
    description: string;
    color?: string;
}

export interface WorkflowStep {
    id: number;
    name: string;
    icon: string;
    description: string;
}

export interface ImpactCard {
    id: number;
    title: string;
    description: string;
    borderColor: string;
    bgColor: string;
}

export interface Partner {
    id: number;
    name: string;
    logoUrl: string;
}

// ============================================
// COMMON ABOUT PAGE STYLES
// ============================================

export const AboutStyles = {
    // Sections
    Section: "w-full py-16 md:py-24",
    SectionLight: "bg-white",
    SectionOffWhite: "bg-slate-50",

    // Container
    Container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    ContainerSmall: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",

    // Typography
    Heading1: "text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900",
    Heading2: "text-3xl md:text-4xl font-bold text-slate-900",
    Heading3: "text-2xl md:text-3xl font-bold text-slate-900",
    Heading4: "text-xl md:text-2xl font-semibold text-slate-900",
    BodyLarge: "text-lg md:text-xl text-slate-600",
    Body: "text-base md:text-lg text-slate-600",
    BodySmall: "text-sm md:text-base text-slate-600",

    // Cards
    Card: "bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8",
    CardHover: "transition-all duration-300 hover:shadow-lg",

    // Colors
    PrimaryBlue: "text-blue-600",
    PrimaryBlueBg: "bg-blue-600",
    SecondaryTeal: "text-emerald-500",
    SecondaryTealBg: "bg-emerald-500",
    AlertRed: "text-rose-500",
    AlertRedBg: "bg-rose-500",

    // Buttons
    ButtonPrimary: "px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors",
    ButtonSecondary: "px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors",
};
