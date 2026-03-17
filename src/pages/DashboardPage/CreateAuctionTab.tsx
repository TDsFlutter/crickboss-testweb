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

interface BidSlab { id: number; from: string; to: string; increment: string; }
const SPORTS = ['Cricket', 'Football', 'Volleyball', 'Basketball', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey'];
interface FormErrors {
    name?: string; date?: string; time?: string; venue?: string;
    pointsPerTeam?: string; baseValue?: string; bidIncrement?: string; playersPerTeam?: string; slabs?: string;
}

export default function CreateAuctionTab() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const banner = useImageCropper();
    const icon = useImageCropper();

    const [isDraggingBanner, setIsDraggingBanner] = useState(false);
    const [isDraggingIcon, setIsDraggingIcon] = useState(false);

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
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
        // Simulate API call
        await new Promise(r => setTimeout(r, 2000));
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className={`${styles.wizardWrap} ${d}`}>
            {banner.rawSrc && <ImageCropper src={banner.rawSrc} aspect={16 / 9} title="Crop Banner" onCropComplete={banner.confirm} onCancel={banner.cancel} />}
            {icon.rawSrc && <ImageCropper src={icon.rawSrc} aspect={1} title="Crop Icon" onCropComplete={icon.confirm} onCancel={icon.cancel} />}

            <input ref={banner.fileInputRef} type="file" accept="image/*" onChange={banner.handleFile} style={{ display: 'none' }} />
            <input ref={icon.fileInputRef} type="file" accept="image/*" onChange={icon.handleFile} style={{ display: 'none' }} />

            <div className={styles.wizardContainer}>
                <header className={styles.wizardHeader}>
                    <h1 className={`${styles.wizardTitle} ${d}`}>Create Custom Auction</h1>
                    <p className={styles.wizardSub}>Step-by-step setup for your league</p>
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
                    Auction Created Successfully!
                </div>
            )}
        </div>
    );
}
