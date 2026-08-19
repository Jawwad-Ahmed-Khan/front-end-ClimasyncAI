import React from 'react';
import HeroSection from '@/app/_components/news_Components/hero_section';
import VerifyNews from '@/app/_components/news_Components/verify_news';
import LatestAlerts from '@/app/_components/news_Components/latest_alerts';
import RelatedAlerts from '@/app/_components/news_Components/related_alerts';
import SocialFeeds from '@/app/_components/news_Components/social_feeds';
import SubscribeSection from '@/app/_components/news_Components/subscribe_section';

export default function News() {
    return (
        <main className="w-full">
            <HeroSection />
            <VerifyNews />
            <LatestAlerts />
            <RelatedAlerts />
            <SocialFeeds />
            <SubscribeSection />
        </main>
    );
}