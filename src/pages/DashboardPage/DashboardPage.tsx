import DashboardLayout from './DashboardLayout';
import type { DashTab } from './DashboardLayout';
import MyAuctionsTab from './MyAuctionsTab';
import CreateAuctionTab from './CreateAuctionTab';
import JoinAsPlayerTab from './JoinAsPlayerTab';
import MyProfileTab from './MyProfileTab';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {(tab: DashTab, setTab: (t: DashTab) => void) => {
                switch (tab) {
                    case 'auctions':
                        return <MyAuctionsTab onCreateClick={setTab} />;
                    case 'create':
                        return <CreateAuctionTab />;
                    case 'join':
                        return <JoinAsPlayerTab />;
                    case 'profile':
                        return <MyProfileTab />;
                    default:
                        return <MyAuctionsTab onCreateClick={setTab} />;
                }
            }}
        </DashboardLayout>
    );
}
