import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsConditionsPage from '../pages/TermsConditionsPage';
import CancellationRefundPage from '../pages/CancellationRefundPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
    return null;
}

// Redirects to dashboard if already logged in
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return null; // Wait for auth check
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}

export default function AppRouter() {
    const { isLoggedIn } = useAuth();

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Routes>
                {/* Protected routes — wrapped in PublicLayout so TopBar/Header/Footer are always visible */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<PublicLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                </Route>

                {/* Public layout routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                    <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
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
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                    <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
