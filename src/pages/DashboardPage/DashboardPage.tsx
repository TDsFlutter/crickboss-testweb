import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import type { DashTab } from './DashboardLayout';
import MyAuctionsTab from './MyAuctionsTab';
import type { Auction } from './MyAuctionsTab';
import CreateAuctionTab from './CreateAuctionTab';
import JoinAsPlayerTab from './JoinAsPlayerTab';
import MyProfileTab from './MyProfileTab';
import ManageAuctionTab from './ManageAuctionTab';
import TournamentsTab from './TournamentsTab';
import ManageTournamentTab from './ManageTournamentTab';
import { api } from '../../utils/api';

export default function DashboardPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0);

    const fetchAuctions = async (force = false) => {
        // Cache for 2 minutes unless forced
        if (!force && Date.now() - lastFetched < 120000 && auctions.length > 0) return;
        
        setIsLoading(true);
        try {
            const res = await api.tournaments.list();
            if (res.success && Array.isArray(res.data)) {
                 // Map the API data to the Auction interface
                const mapped: Auction[] = res.data.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    sport: (t.play_type || t.sport || 'Cricket').charAt(0).toUpperCase() + (t.play_type || t.sport || 'Cricket').slice(1).toLowerCase(),
                    date: t.start_date || t.date || 'TBD',
                    venue: t.venue || 'No Venue',
                    teams: t.teamsCount || t.teams?.length || 0,
                    players: t.playersCount || t.players?.length || 0,
                    status: (t.tournament_status || t.status || 'upcoming').toLowerCase() as any,
                    emoji: (t.play_type || t.sport)?.toLowerCase() === 'football' ? '⚽' : (t.play_type || t.sport)?.toLowerCase() === 'volleyball' ? '🏐' : '🏏',
                    bannerClass: (t.play_type || t.sport || 'cricket').toLowerCase(),
                    bannerUrl: t.banner_url || t.banner
                }));
                setAuctions(mapped);
                setLastFetched(Date.now());
            }
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    return (
        <DashboardLayout>
            {(tab: DashTab, setTab: (t: DashTab) => void) => {
                const onManage = (id: number) => {
                    setSelectedId(id);
                    setTab('manage');
                };
                const onManageTournament = (id: number) => {
                    setSelectedId(id);
                    setTab('manageTournament');
                };

                const refresh = () => fetchAuctions(true);

                switch (tab) {
                    case 'auctions':
                        return (
                            <MyAuctionsTab 
                                auctions={auctions} 
                                isLoading={isLoading} 
                                onRefresh={refresh}
                                onCreateClick={setTab} 
                                onManageClick={onManage} 
                            />
                        );
                    case 'tournaments':
                        return <TournamentsTab onManageClick={onManageTournament} />;
                    case 'create':
                        return <CreateAuctionTab onClose={() => { refresh(); setTab('auctions'); }} />;
                    case 'join':
                        return <JoinAsPlayerTab />;
                    case 'profile':
                        return <MyProfileTab />;
                    case 'manage':
                        return <ManageAuctionTab auctionId={selectedId} onBack={() => setTab('auctions')} />;
                    case 'manageTournament':
                        return <ManageTournamentTab tournamentId={selectedId} onBack={() => setTab('tournaments')} />;
                    default:
                        return (
                            <MyAuctionsTab 
                                auctions={auctions} 
                                isLoading={isLoading} 
                                onRefresh={refresh}
                                onCreateClick={setTab} 
                                onManageClick={onManage} 
                            />
                        );
                }
            }}
        </DashboardLayout>
    );
}
