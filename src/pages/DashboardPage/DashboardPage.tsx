import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import type { DashTab } from './DashboardLayout';
import MyAuctionsTab from './MyAuctionsTab';
import CreateAuctionTab from './CreateAuctionTab';
import JoinAsPlayerTab from './JoinAsPlayerTab';
import MyProfileTab from './MyProfileTab';
import ManageAuctionTab from './ManageAuctionTab';

export default function DashboardPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <DashboardLayout>
            {(tab: DashTab, setTab: (t: DashTab) => void) => {
                const onManage = (id: number) => {
                    setSelectedId(id);
                    setTab('manage');
                };

                switch (tab) {
                    case 'auctions':
                        return <MyAuctionsTab onCreateClick={setTab} onManageClick={onManage} />;
                    case 'create':
                        return <CreateAuctionTab />;
                    case 'join':
                        return <JoinAsPlayerTab />;
                    case 'profile':
                        return <MyProfileTab />;
                    case 'manage':
                        return <ManageAuctionTab auctionId={selectedId} onBack={() => setTab('auctions')} />;
                    default:
                        return <MyAuctionsTab onCreateClick={setTab} onManageClick={onManage} />;
                }
            }}
        </DashboardLayout>
    );
}
