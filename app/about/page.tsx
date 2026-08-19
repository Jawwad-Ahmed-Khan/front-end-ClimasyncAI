import React from 'react';
import HeroSection from '@/app/_components/about_components/hero_section';
import MissionVision from '@/app/_components/about_components/mission_vision';
import WhyWe from '@/app/_components/about_components/why_we';
import WorkFlow from '@/app/_components/about_components/work_flow';
import Impact from '@/app/_components/about_components/impact';
import Partner from '@/app/_components/about_components/partner';
import TeamPartner from '@/app/_components/about_components/team_partner';
import JoinUs from '@/app/_components/about_components/join_us';

export default function AboutPage() {
    return (
        <main className="w-full">
            <HeroSection />
            <MissionVision />
            <WhyWe />
            <WorkFlow />
            <Impact />
            <TeamPartner />
            <Partner />
            <JoinUs />
        </main>
    );
}
