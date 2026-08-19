// ============================================
// NEWS PAGE - TYPE DEFINITIONS
// ============================================

export interface AlertCard {
    id: number;
    type: string;
    title: string;
    description: string;
    image: string;
    severity: 'Real' | 'Fake' | 'Pass-Fake';
    location?: string;
    time?: string;
}

export interface SocialFeed {
    id: number;
    platform: 'Facebook' | 'LinkedIn' | 'X' | 'Instagram';
    content: string;
    image?: string;
    rating?: number;
    author?: string;
}

export interface SearchFilters {
    region: string;
    type: string;
    time: string;
}

// ============================================
// COMMON REUSABLE STYLES
// ============================================

export const CommonStyles = {
    // Typography
    Heading1: "text-3xl md:text-5xl font-bold",
    Heading2: "text-2xl md:text-3xl font-bold",
    Heading3: "text-xl md:text-2xl font-bold",
    Heading4: "text-lg md:text-xl font-semibold",
    BodyText: "text-base md:text-lg",
    SmallText: "text-sm md:text-base",
    TinyText: "text-xs md:text-sm",

    // Spacing - Padding
    PaddingSection: "py-12 md:py-20",
    PaddingSectionSmall: "py-8 md:py-12",
    PaddingSectionLarge: "py-16 md:py-24",
    PaddingCard: "p-4 md:p-6",
    PaddingForm: "p-6 md:p-8",
    PaddingButton: "px-8 py-3",
    PaddingButtonLarge: "px-8 py-4",

    // Spacing - Margin
    MarginBottom: "mb-6 md:mb-8",
    MarginBottomSmall: "mb-3 md:mb-4",
    MarginBottomLarge: "mb-8 md:mb-12",

    // Layout
    Container: "max-w-7xl mx-auto px-4",
    ContainerSmall: "max-w-4xl mx-auto px-4",
    ContainerLarge: "max-w-full px-4",

    // Grid Layouts
    Grid1Col: "grid grid-cols-1 gap-6",
    Grid1to2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    Grid1to2to3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    Grid1to3: "grid grid-cols-1 md:grid-cols-3 gap-4",

    // Flex Layouts
    FlexBetween: "flex justify-between items-center",
    FlexCenter: "flex items-center justify-center",
    FlexCol: "flex flex-col",
    FlexRow: "flex flex-row",
    FlexResponsive: "flex flex-col md:flex-row",

    // Buttons
    ButtonBase: "rounded-md font-bold transition-colors",
    ButtonPrimary: "px-8 py-3 rounded-md font-bold transition-colors",
    ButtonLarge: "px-8 py-4 rounded-lg font-bold text-lg transition-colors",

    // Inputs
    Input: "w-full px-4 py-3 rounded-md border-2 focus:outline-none",
    Select: "px-4 py-3 border rounded-md focus:outline-none focus:ring-2",

    // Cards
    Card: "rounded-lg overflow-hidden",
    CardHover: "hover:scale-105 transition-transform duration-300",

    // Colors & Backgrounds
    BgDark: "bg-gray-950",
    BgCard: "bg-gray-900",
    BgWhite: "bg-white",
    TextWhite: "text-white",
    TextGray: "text-gray-400",
    TextBlack: "text-black",

    // Border & Radius
    Rounded: "rounded-md",
    RoundedLarge: "rounded-lg",
    RoundedFull: "rounded-full",

    // Shadows & Effects
    Shadow: "shadow-lg",
    ShadowXL: "shadow-xl",
    ShadowHover: "hover:shadow-xl transition-shadow",

    // Transitions
    TransitionAll: "transition-all duration-300",
    TransitionColors: "transition-colors",
    TransitionTransform: "transition-transform",
};
