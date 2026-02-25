import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import HomePage from '../pages/HomePage';
import TodayAuctionsPage from '../pages/TodayAuctionsPage';
import UpcomingAuctionsPage from '../pages/UpcomingAuctionsPage';
import VideoGalleryPage from '../pages/VideoGalleryPage';
import FeaturesPage from '../pages/FeaturesPage';
import PricingPage from '../pages/PricingPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import FAQPage from '../pages/FAQPage';
import AboutPage from '../pages/AboutPage';
import ClientsPage from '../pages/ClientsPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
    return null;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auctions/today" element={<TodayAuctionsPage />} />
                    <Route path="/auctions/upcoming" element={<UpcomingAuctionsPage />} />
                    <Route path="/video-gallery" element={<VideoGalleryPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
