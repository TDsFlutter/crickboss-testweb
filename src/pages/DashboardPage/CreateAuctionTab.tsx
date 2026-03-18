import { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ImageCropper, { useImageCropper } from '../../components/ImageCropper/ImageCropper';
import styles from './CreateAuctionTab.module.css';

// Components
import AuctionStepper from './components/AuctionStepper/AuctionStepper';
import DetailsStep from './components/CreateAuctionSteps/DetailsStep';
import TeamsStep from './components/CreateAuctionSteps/TeamsStep';
import PlayersStep from './components/CreateAuctionSteps/PlayersStep';
import VerifyStep from './components/CreateAuctionSteps/VerifyStep';

import { api } from '../../utils/api';

interface BidSlab { id: number; from: string; to: string; increment: string; }
const SPORTS = ['Cricket', 'Football', 'Volleyball', 'Basketball', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey'];
interface FormErrors {
    name?: string; date?: string; time?: string; venue?: string;
    pointsPerTeam?: string; baseValue?: string; bidIncrement?: string; playersPerTeam?: string; slabs?: string;
}

export default function CreateAuctionTab({ onClose }: { onClose?: () => void }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const banner = useImageCropper();
    const icon = useImageCropper();

    const [isDraggingBanner, setIsDraggingBanner] = useState(false);
    const [isDraggingIcon, setIsDraggingIcon] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Reusable drag handlers
    const makeDragHandlers = (setDragging: (v: boolean) => void, handleFile: (e: any) => void) => ({
        onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragging(true); },
        onDragEnter: (e: React.DragEvent) => { e.preventDefault(); setDragging(true); },
        onDragLeave: () => setDragging(false),
        onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (!file || !file.type.startsWith('image/')) return;
            const dt = new DataTransfer();
            dt.items.add(file);
            const fakeInput = document.createElement('input');
            fakeInput.type = 'file';
            Object.defineProperty(fakeInput, 'files', { value: dt.files });
            handleFile({ target: fakeInput } as unknown as React.ChangeEvent<HTMLInputElement>);
        },
    });

    const [form, setForm] = useState({
        name: '', date: '', time: '', venue: '', sport: 'Cricket',
        pointsPerTeam: '50000', baseValue: '100', bidIncrement: '50', playersPerTeam: '11',
        visibility: 'Private',
        bidSlabs: [] as BidSlab[],
    });
    const [teams, setTeams] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [activeStep, setActiveStep] = useState(1);

    const handleAddSlab = () => {
        const newSlab: BidSlab = { id: Date.now(), from: '', to: '', increment: '' };
        setForm(f => ({ ...f, bidSlabs: [...f.bidSlabs, newSlab] }));
    };

    const handleRemoveSlab = (id: number) => {
        setForm(f => ({ ...f, bidSlabs: f.bidSlabs.filter(s => s.id !== id) }));
    };

    const handleSlabChange = (id: number, k: keyof BidSlab, v: string) => {
        setForm(f => ({
            ...f,
            bidSlabs: f.bidSlabs.map(s => s.id === id ? { ...s, [k]: v } : s)
        }));
    };

    const handleFieldChange = (k: string, v: string) => {
        setForm(f => ({ ...f, [k]: v }));
        if (errors[k as keyof FormErrors]) {
            setErrors(prev => { const e = { ...prev }; delete e[k as keyof FormErrors]; return e; });
        }
    };

    const validateDetails = () => {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = 'Auction name is required.';
        if (!form.date) e.date = 'Date is required.';
        if (!form.time) e.time = 'Time is required.';
        if (!form.venue.trim()) e.venue = 'Venue is required.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (activeStep === 1 && !validateDetails()) return;
        setActiveStep(prev => Math.min(prev + 1, 4));
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleAddTeam = (team: any) => setTeams(prev => [...prev, team]);
    const handleDeleteTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id));
    
    const handleAddPlayer = (player: any) => setPlayers(prev => [...prev, player]);
    const handleDeletePlayer = (id: string) => setPlayers(prev => prev.filter(p => p.id !== id));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Create Tournament
            const tournamentRes = await api.tournaments.create({
                name: form.name,
                play_type: form.sport.toLowerCase(),
                start_date: form.date,
                start_time: form.time,
                venue: form.venue,
                budget_per_team: Number(form.pointsPerTeam),
                min_bid: Number(form.baseValue),
                bid_increment: Number(form.bidIncrement),
                min_players_per_team: Number(form.playersPerTeam),
                max_players_per_team: Number(form.playersPerTeam),
                is_private: form.visibility.toLowerCase() === 'private',
                banner_url: banner.resultUrl,
                icon_url: icon.resultUrl,
                tournament_status: 'upcoming'
            });

            if (!tournamentRes.success || !tournamentRes.data) {
                throw new Error(tournamentRes.message || 'Failed to create tournament');
            }

            const tournamentId = (tournamentRes.data as any).id;
            console.log('Tournament created with ID:', tournamentId);

            // 2. Add Teams
            if (teams.length > 0) {
                console.log('Adding teams...');
                await Promise.all(teams.map(team => 
                    api.tournaments.teams.add(tournamentId, {
                        name: team.name,
                        short_name: team.shortName || team.name.substring(0, 3).toUpperCase(),
                        logo_url: team.logo
                    })
                ));
            }

            // 3. Add Players
            if (players.length > 0) {
                console.log('Adding players...');
                await Promise.all(players.map(player => 
                    api.tournaments.players.add(tournamentId, {
                        name: player.name,
                        photo_url: player.photo,
                        category: player.category,
                        base_price: Number(player.basePrice)
                    })
                ));
            }

            setToast({
                show: true,
                message: 'Auction created successfully!',
                type: 'success'
            });
            
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                if (onClose) onClose(); // Switch to My Auctions tab
            }, 2000);

        } catch (err: any) {
            console.error('Submit Error:', err);
            setToast({
                show: true,
                message: err.message || 'Something went wrong. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`${styles.wizardWrap} ${d}`}>
            {banner.rawSrc && <ImageCropper src={banner.rawSrc} aspect={16 / 9} title="Crop Banner" onCropComplete={banner.confirm} onCancel={banner.cancel} />}
            {icon.rawSrc && <ImageCropper src={icon.rawSrc} aspect={1} title="Crop Icon" onCropComplete={icon.confirm} onCancel={icon.cancel} />}

            <input ref={banner.fileInputRef} type="file" accept="image/*" onChange={banner.handleFile} style={{ display: 'none' }} />
            <input ref={icon.fileInputRef} type="file" accept="image/*" onChange={icon.handleFile} style={{ display: 'none' }} />

            <div className={styles.wizardContainer}>
                <header className={styles.wizardHeader}>
                    <h1 className={`${styles.wizardTitle} ${d}`}>Create Tournament</h1>
                    <p className={styles.wizardSub}>Step-by-step setup for your cricket tournament</p>
                </header>

                <AuctionStepper currentStep={activeStep} totalSteps={4} />

                {activeStep === 1 && (
                    <DetailsStep 
                        data={form} 
                        errors={errors} 
                        onFieldChange={handleFieldChange} 
                        onNext={handleNext}
                        banner={banner}
                        icon={icon}
                        isDraggingBanner={isDraggingBanner}
                        setIsDraggingBanner={setIsDraggingBanner}
                        isDraggingIcon={isDraggingIcon}
                        setIsDraggingIcon={setIsDraggingIcon}
                        makeDragHandlers={makeDragHandlers}
                        SPORTS={SPORTS}
                        onAddSlab={handleAddSlab}
                        onRemoveSlab={handleRemoveSlab}
                        onSlabChange={handleSlabChange}
                    />
                )}

                {activeStep === 2 && (
                    <TeamsStep 
                        teams={teams}
                        onAddTeam={handleAddTeam}
                        onDeleteTeam={handleDeleteTeam}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {activeStep === 3 && (
                    <PlayersStep 
                        players={players}
                        onAddPlayer={handleAddPlayer}
                        onDeletePlayer={handleDeletePlayer}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {activeStep === 4 && (
                    <VerifyStep 
                        data={form}
                        teams={teams}
                        players={players}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>

            {submitted && (
                <div className={styles.successToast}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    🏆 Tournament Created Successfully!
                </div>
            )}
        </div>
    );
}
