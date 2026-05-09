import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, darken } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PagesEnum } from '../../../../enums/PagesEnum';
import Loader from '../../../../utils/Loader';
import { toast } from 'react-toastify';
import { LocationPicker } from './LocationPicker';
import { PhotoUploader } from './PhotoUploader';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { useReportCategories } from '../../../../hooks/ReportCategories';
import { useCreateReport, useUploadAndAnalyze } from '../../../../hooks/Reports';

type Location = { latLng: { lat: number; lng: number }; address: string };

const CreateReportPage = () => {
    const navigate = useNavigate();
    const { data: reportCategories } = useReportCategories();
    const { mutateAsync: createReport } = useCreateReport();
    const { mutateAsync: uploadAndAnalyze, isPending: isUploading } = useUploadAndAnalyze();

    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<Location | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [showMap, setShowMap] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [descriptionRows, setDescriptionRows] = useState<number>(3);

    const handleMapToggle = (mapShown: boolean) => {
        setShowMap(mapShown);
        setDescriptionRows(mapShown ? 3 : 7);
    };

    useEffect(() => {
        console.log(reportCategories);
    }, [reportCategories]);

    const validate = (): boolean => {
        if (!category) { toast.error('Please provide a category.'); return false; }
        if (!description) { toast.error('Please provide a description.'); return false; }
        if (!location) { toast.error('Please provide a location.'); return false; }
        return true;
    };

    const handleAutoFill = async () => {
        if (!selectedFile) { toast.error('Please select an image first.'); return; }
        try {
            const result = await uploadAndAnalyze(selectedFile);
            setUploadedImageUrl(result.imageUrl);
            if (result.aiDraft?.categoryId) setCategory(String(result.aiDraft.categoryId));
            if (result.aiDraft?.description) setDescription(result.aiDraft.description);
            toast.success('AI analysis complete!');
        } catch {
            toast.error('Failed to analyze the image. Please try again.');
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const raw = localStorage.getItem('fixity.auth');
            const cityId = raw ? JSON.parse(raw).user?.cityId : null;

            let imageUrl = uploadedImageUrl;
            if (selectedFile && !imageUrl) {
                const result = await uploadAndAnalyze(selectedFile);
                imageUrl = result.imageUrl;
                setUploadedImageUrl(result.imageUrl);
            }

            await createReport({
                categoryId: +category,
                cityId,
                description,
                latitude: location?.latLng.lat,
                longitude: location?.latLng.lng,
                beforeImageUrl: imageUrl ?? "",
            });
            toast.success('Report created successfully!');
            navigate(`/${PagesEnum.HOME}`);
        } catch {
            toast.error('An error occurred while creating the report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', background: 'background.default' }}>
            <PageHeader title="New Report" backTo={`/${PagesEnum.HOME}`} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: '1rem', padding: { xs: '1rem', md: '2rem' }, height: { xs: 'auto', md: '45.5rem' } }}>
                <PhotoUploader onFileChange={(file) => { setSelectedFile(file); setUploadedImageUrl(null); }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'space-between' }}>
                    <LocationPicker showMap={showMap} setShowMap={setShowMap} onChange={setLocation} onMapToggle={handleMapToggle} />

                    <Button
                        variant="contained"
                        startIcon={isUploading ? <Loader /> : <AutoAwesomeIcon sx={{ color: 'warning.main' }} />}
                        disabled={!selectedFile || isUploading}
                        onClick={handleAutoFill}
                        sx={{
                            bgcolor: 'magic.main',
                            color: 'magic.contrastText',
                            fontSize: '1rem',
                            height: '3.5rem',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 12px rgba(111, 78, 242, 0.3)',
                            '&:hover': { bgcolor: (theme) => darken(theme.palette.magic.main, 0.2) },
                            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
                        }}
                    >
                        {isUploading ? 'Analyzing...' : 'Auto-fill details with AI'}
                    </Button>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Category
                        </Typography>
                        <TextField
                            select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            slotProps={{ select: { displayEmpty: true } }}
                            sx={{
                                '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '0.5rem' },
                                '& .MuiSelect-select': { color: category ? 'text.primary' : 'text.disabled' },
                            }}
                        >
                            <MenuItem value="" disabled>Select a category...</MenuItem>
                            {reportCategories?.map((category: { reportCategoryId: number; name: string }) => (
                                <MenuItem key={category.reportCategoryId} value={category.reportCategoryId}>{category.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Description
                        </Typography>
                        <TextField
                            onFocus={() => handleMapToggle(false)}
                            multiline
                            placeholder="Describe the issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            helperText={`${description.length}/1000`}
                            slotProps={{
                                htmlInput: { maxLength: 1000, style: { overflow: 'auto', resize: 'none' } },
                                formHelperText: { sx: { textAlign: 'right', mr: 0, fontWeight: 600, fontSize: '0.7rem' } },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'background.paper',
                                    borderRadius: '0.5rem',
                                    height: descriptionRows === 3 ? '5.5rem' : '12rem',
                                    alignItems: 'flex-start',
                                    transition: 'height 0.3s ease',
                                },
                                '& textarea': { height: '100% !important' },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ paddingX: '1.5rem', marginBottom: '1rem' }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                        height: '3.5rem',
                        bgcolor: 'reportAction.main',
                        color: 'reportAction.contrastText',
                        fontSize: '1.05rem',
                        borderRadius: '1rem',
                        '&:hover': { bgcolor: (theme) => darken(theme.palette.reportAction.main, 0.3) },
                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
                    }}
                >
                    {isSubmitting ? <Loader /> : 'Open Report'}
                </Button>
            </Box>
        </Box>
    );
};

export default CreateReportPage;